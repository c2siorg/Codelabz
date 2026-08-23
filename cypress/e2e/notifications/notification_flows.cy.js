/// <reference types="cypress" />

const BASE_URL = "http://localhost:5173/";
let MAHENDER;
let SARFARAZ;

const loginAs = user => {
  indexedDB.deleteDatabase("firebaseLocalStorageDb");
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit(`${BASE_URL}login`);
  cy.get(".email").type(user.email);
  cy.get(".password").type(user.password);
  cy.get(".loginButton").click();
  cy.location("pathname", { timeout: 15000 }).should(
    "eq",
    "/dashboard/my_feed"
  );
};

describe("Real-time notifications | client-side writes", () => {
  before(() => {
    cy.fixture("notif_user_mahender").then(user => {
      MAHENDER = user;
    });
    cy.fixture("notif_user_sarfaraz").then(user => {
      SARFARAZ = user;
    });
  });

  it("mahender follows sarfaraz -> sarfaraz's profile shows follow button flip", () => {
    loginAs(MAHENDER);
    cy.visit(`${BASE_URL}user/sarfaraz`);

    // Exact-match regexes: cy.contains does substring matching, and "unfollow"
    // contains "follow", so a loose match could click the wrong button.
    // If a previous run left the follow in place, clear it first.
    cy.contains("button", /^(un)?follow$/i, { timeout: 15000 })
      .should("be.visible")
      .invoke("text")
      .then(text => {
        if (/^unfollow$/i.test(text.trim())) {
          cy.contains("button", /^unfollow$/i).click();
          cy.contains("button", /^follow$/i, { timeout: 10000 }).should(
            "be.visible"
          );
        }
      });

    cy.contains("button", /^follow$/i, { timeout: 15000 }).click();
    // The button flips in place now that ViewProfile refetches after the write.
    cy.contains("button", /^unfollow$/i, { timeout: 10000 }).should(
      "be.visible"
    );
    cy.screenshot("01-mahender-followed-sarfaraz");
  });

  it("sarfaraz sees the follow notification in the bell dropdown", () => {
    loginAs(SARFARAZ);
    cy.get('[aria-label="Open notifications"]', { timeout: 10000 })
      .first()
      .click();
    cy.contains("Notifications").should("be.visible");
    cy.contains("started following you", { timeout: 10000 }).should(
      "be.visible"
    );
    cy.screenshot("02-sarfaraz-sees-follow-notification");
  });

  it("sarfaraz comments on mahender's tutorial", () => {
    // already logged in as sarfaraz from previous test (testIsolation: false)
    cy.visit(`${BASE_URL}tutorial/test-notif-tutorial-001`);
    cy.get("#comments", { timeout: 10000 }).should("be.visible");
    cy.get("#comments input").first().type("This is a great tutorial!{enter}");
    cy.wait(2000);
    // Comment.jsx used to crash (blank page) rendering the comment list right
    // after posting, due to an undefined entry in commentsArray/repliesArray.
    // Asserting the comment renders proves that's fixed, not just tolerated.
    cy.contains("This is a great tutorial!", { timeout: 10000 }).should(
      "be.visible"
    );
    cy.screenshot("03-sarfaraz-commented");
  });

  it("mahender sees the comment notification in the bell dropdown", () => {
    loginAs(MAHENDER);
    cy.get('[aria-label="Open notifications"]', { timeout: 10000 })
      .first()
      .click();
    cy.contains("commented on", { timeout: 10000 }).should("be.visible");
    cy.screenshot("04-mahender-sees-comment-notification");
  });

  it("mahender replies to sarfaraz's comment", () => {
    // already logged in as mahender from previous test
    cy.visit(`${BASE_URL}tutorial/test-notif-tutorial-001`);
    cy.contains("This is a great tutorial!", { timeout: 10000 }).should(
      "be.visible"
    );
    // the "Reply" button doubles as "show reply field" — click reveals the textbox
    cy.contains("button", "Reply").click();
    cy.get("input").last().type("Thanks for the feedback!{enter}");
    cy.wait(2000);
    cy.contains("Thanks for the feedback!", { timeout: 10000 }).should(
      "be.visible"
    );
    cy.screenshot("05-mahender-replied");
  });

  it("sarfaraz sees the reply notification and likes mahender's reply", () => {
    loginAs(SARFARAZ);
    cy.get('[aria-label="Open notifications"]', { timeout: 10000 })
      .first()
      .click();
    cy.contains("replied to your comment", { timeout: 10000 }).should(
      "be.visible"
    );
    cy.screenshot("06-sarfaraz-sees-reply-notification");

    cy.visit(`${BASE_URL}tutorial/test-notif-tutorial-001`);
    cy.contains("This is a great tutorial!", { timeout: 10000 }).should(
      "be.visible"
    );
    // clicking "Reply" here also reveals the existing reply thread (same
    // toggle serves both purposes), which is what surfaces mahender's reply
    cy.contains("button", "Reply").click();
    cy.contains("Thanks for the feedback!", { timeout: 10000 }).should(
      "be.visible"
    );
    // Scope the like to mahender's reply specifically. Using .last() here is
    // racy: if the reply's like button hasn't mounted yet, .last() lands on
    // sarfaraz's own comment, the self-like guard skips the notification, and
    // the next test fails. aria-pressed confirms the like actually registered.
    cy.contains("Thanks for the feedback!")
      .closest(".MuiPaper-root")
      .find('[aria-label="like"]')
      .click()
      .should("have.attr", "aria-pressed", "true");
    cy.screenshot("07-sarfaraz-liked-reply");
  });

  it("mahender sees the comment-like notification in the bell dropdown", () => {
    loginAs(MAHENDER);
    cy.get('[aria-label="Open notifications"]', { timeout: 10000 })
      .first()
      .click();
    cy.contains("liked your comment", { timeout: 10000 }).should("be.visible");
    cy.screenshot("08-mahender-sees-like-notification");
  });

  // Org-join notification (addOrgUser fan-out to existing owners) is not
  // covered here: the live Organization page's "Users" tab (pages/Users.jsx)
  // renders static mock data and never mounts OrgUsersCard/AddOrgUserModal —
  // the only component wired to the real addOrgUser action. That component
  // is only used in the deprecated index_old.jsx, so there is currently no
  // reachable UI path to add an org member. Pre-existing gap, unrelated to
  // the notification changes. addOrgUser's notification logic (recipient
  // resolution, owner fan-out, self-join skip) was verified directly against
  // the real action code and a live Firestore emulator instead.
});
