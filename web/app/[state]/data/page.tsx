"use client";
import React, { useState, useCallback, useEffect } from "react";
import AgencyTable from "../../components/AgencyTable/AgencyTable";
import Header from "../../components/Header/Header";
import styles from "./DataPage.module.scss";

interface AgencyData {
  agency_name: string;
  person_nbr: string;
  first_name: string;
  last_name: string;
  start_date: string;
  end_date: string;
  separation_reason: string;
}

interface Filters {
  lastName: string;
  firstName: string;
  agencyName: string;
  uid: string;
}

const DataPage = ({ params }: { params: { state: string } }) => {
  const [selectedState, setSelectedState] = useState<string>(params.state);
  const [agencyData, setAgencyData] = useState<AgencyData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filters, setFilters] = useState<Filters>({
    lastName: "",
    firstName: "",
    agencyName: "",
    uid: "",
  });

  const fetchStateData = useCallback(
    async (page: number, size: number, currentFilters: Filters) => {
      if (!selectedState || isLoading) return;

      setIsLoading(true);
      setError(null);
      const queryParams = new URLSearchParams({
        state: selectedState,
        page: page.toString(),
        pageSize: size.toString(),
        ...currentFilters,
      });

      try {
        const response = await fetch(`/api/fetchStateData?${queryParams}`);
        if (!response.ok) {
          throw new Error("Failed to fetch state data");
        }
        const { data, totalCount } = await response.json();
        setAgencyData(data);
        setTotalCount(totalCount);
      } catch (error) {
        console.error("Error fetching state data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [selectedState, isLoading]
  );

  useEffect(() => {
    if (selectedState) {
      fetchStateData(currentPage, pageSize, filters);
    }
  }, [selectedState, currentPage, pageSize, filters, fetchStateData]);

  const handleStateSelection = (state: string) => {
    setSelectedState(state);
    setAgencyData([]);
    setCurrentPage(1);
    setFilters({
      lastName: "",
      firstName: "",
      agencyName: "",
      uid: "",
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className={`${styles.pageContainer} flex flex-col h-screen`}>
      <Header
        selectedState={selectedState}
        onStateChange={handleStateSelection}
      />
      <main className="flex-grow p-4">
        <div>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div>
              <AgencyTable
                agencyData={agencyData}
                totalCount={totalCount}
                isLoading={isLoading}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                onFilterChange={handleFilterChange}
                filters={filters}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DataPage;
