"""
ChromaDB vector-store helper for the CodeLabz Documentation Agent.

Usage
-----
Typical flow:

1. Index lab guides once::

       from ai_agent.vector_store import VectorStoreManager
       manager = VectorStoreManager()
       manager.index_documents(docs)        # list[str] or list[Document]

2. Query at runtime::

       results = manager.similarity_search(query, k=4)
"""

import logging
import os
from typing import List

import chromadb
from chromadb.config import Settings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from langchain_openai import OpenAIEmbeddings

logger = logging.getLogger(__name__)

_COLLECTION_NAME = "codelabz_kb"
_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")


class VectorStoreManager:
    """Thin wrapper around a persistent Chroma collection."""

    def __init__(self) -> None:
        self._embeddings = OpenAIEmbeddings(
            model="text-embedding-3-small",
            openai_api_key=os.getenv("OPENAI_API_KEY"),
        )
        self._client = chromadb.PersistentClient(
            path=_PERSIST_DIR,
            settings=Settings(anonymized_telemetry=False),
        )
        self._vectorstore = Chroma(
            client=self._client,
            collection_name=_COLLECTION_NAME,
            embedding_function=self._embeddings,
        )

    # ------------------------------------------------------------------
    # Write
    # ------------------------------------------------------------------

    def index_documents(self, docs: List[str | Document]) -> None:
        """Add *docs* to the collection, converting plain strings if needed."""
        documents: List[Document] = []
        for item in docs:
            if isinstance(item, str):
                documents.append(Document(page_content=item))
            else:
                documents.append(item)

        if not documents:
            logger.warning("index_documents called with an empty list – skipping.")
            return

        self._vectorstore.add_documents(documents)
        logger.info("Indexed %d document(s) into ChromaDB.", len(documents))

    # ------------------------------------------------------------------
    # Read
    # ------------------------------------------------------------------

    def similarity_search(self, query: str, k: int = 4) -> List[str]:
        """Return the *k* most-relevant passages for *query*."""
        results: List[Document] = self._vectorstore.similarity_search(query, k=k)
        return [doc.page_content for doc in results]

    def as_retriever(self, k: int = 4):
        """Return a LangChain-compatible retriever for use in chains."""
        return self._vectorstore.as_retriever(search_kwargs={"k": k})
