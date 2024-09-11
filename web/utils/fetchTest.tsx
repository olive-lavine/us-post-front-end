interface Props {
  state: string;
  page?: string;
  pageSize?: string;
  filters?: Filters;
}

interface Filters {
  lastName: string;
  firstName: string;
  agencyName: string;
  uid: string;
}

export default async function fetchTest(
  state: string,
  page: number,
  pageSize: number,
  filters: Filters
) {
  const queryParams = new URLSearchParams({
    state,
    page: page.toString(),
    pageSize: pageSize.toString(),
    lastName: filters.lastName,
    firstName: filters.firstName,
    agencyName: filters.agencyName,
    uid: filters.uid,
  });

  try {
    const response = await fetch(
      `http://localhost:3000/api/fetchStateData?${queryParams}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch state data");
    }
    const { data, totalCount } = await response.json();
    return { data, totalCount };
  } catch (error) {
    console.error("Error fetching state data:", error);
    return {
      data: [],
      totalCount: 0,
      error: "Failed to load data. Please try again.",
    };
  }
}
