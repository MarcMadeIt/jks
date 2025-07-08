"use client";

import React, { useState, useEffect } from "react";
import { getAllNews } from "@/lib/client/actions";
import NewsList from "./NewsList";
import NewsPagination from "./NewsPagination";

const News = () => {
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const { total } = await getAllNews(page);
        setTotal(total);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      }
    };

    fetchCases();
  }, [page]);

  return (
    <div className="flex flex-col md:items-start gap-7  w-full">
      <NewsList page={page} setTotal={setTotal} />
      <div className="flex w-full justify-center">
        {total > 6 && (
          <NewsPagination page={page} setPage={setPage} total={total} />
        )}
      </div>
    </div>
  );
};

export default News;
