// import React from "react";
// import AgencyTable from "../../components/AgencyTable/AgencyTable";
// import styles from "./DataPage.module.scss";
// import fetchTest from "../../../utils/fetchTest";
// import { db } from "../../../utils/firebaseConfig";
// import { collection, query, where, orderBy, limit, startAfter, getDocs, Query, DocumentData } from 'firebase/firestore';

// interface Filters {
//   lastName: string;
//   firstName: string;
//   agencyName: string;
//   uid: string;
// }
// async function fetchFirestoreData() {
//   const uploadsRef = collection(db, 'uploads');
//   const snapshot = await getDocs(uploadsRef);
//   return snapshot.docs.map(doc => doc.data());
// }

// interface Props {
//   params: { state: string };
//   // searchParams: {
//   //   page?: string;
//   //   pageSize?: string;
//   //   lastName?: string;
//   //   firstName?: string;
//   //   agencyName?: string;
//   //   uid?: string;
//   // };
// }

// export default async function DataPage({ params }: Props) {
//   const state = params.state;
//   // const page = parseInt(searchParams.page || "1", 10);
//   // const pageSize = parseInt(searchParams.pageSize || "10", 10);

//   // // Extract filters from searchParams
//   // const filters: Filters = {
//   //   lastName: searchParams.lastName || "",
//   //   firstName: searchParams.firstName || "",
//   //   agencyName: searchParams.agencyName || "",
//   //   uid: searchParams.uid || "",
//   // };

//   // // Fetch data with filters
//   // const { data, totalCount } = await fetchStateData(
//   //   state,
//   //   page,
//   //   pageSize,
//   //   filters
//   // );
//   const { data, totalCount } = await fetchTest(state, 1, 10, {
//     lastName: "",
//     firstName: "",
//     agencyName: "",
//     uid: "",
//   });

//   return (
//     <div className={`${styles.pageContainer} flex flex-col h-screen`}>
//       {/* <main className="flex-grow p-4">
//         <AgencyTable
//           state={state}
//           initialData={data}
//           totalCount={totalCount}
//           page={1}
//           pageSize={10}
//         />
//       </main> */}
//     </div>
//   );
// }
// app/state/[state]/page.tsx
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { db } from "../../../utils/firebaseConfig";

type AgencyData = {
  agency_name: string;
  person_nbr: string;
  first_name: string;
  last_name: string;
  start_date: string;
  end_date: string;
  separation_reason: string;
};

interface PageProps {
  params: {
    state: string;
  };
  searchParams: {
    page?: string;
    pageSize?: string;
    lastName?: string;
    firstName?: string;
    agencyName?: string;
    uid?: string;
  };
}

export default async function StatePage({ params, searchParams }: PageProps) {
  const data = await fetchAgencyData({
    state: params.state,
    page: searchParams.page,
    pageSize: searchParams.pageSize,
    lastName: searchParams.lastName,
    firstName: searchParams.firstName,
    agencyName: searchParams.agencyName,
    uid: searchParams.uid,
  });
  console.log(data);

  return (
    <div>
      <h1>Agency Data for {params.state}</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
}

async function fetchAgencyData({
  state,
  page = "1",
  pageSize = "10",
  lastName = "",
  firstName = "",
  agencyName = "",
  uid = "",
}: {
  state: string;
  page?: string;
  pageSize?: string;
  lastName?: string;
  firstName?: string;
  agencyName?: string;
  uid?: string;
}): Promise<AgencyData[]> {
  const currentPage = parseInt(page, 10);
  const size = parseInt(pageSize, 10);

  const formattedState = state.toLowerCase().replace(/\s+/g, "-");
  const uploadsRef = collection(db, "uploads");

  let firestoreQuery = query(
    uploadsRef,
    where("__name__", ">=", `${formattedState}-processed.csv_`),
    where("__name__", "<", `${formattedState}-processed.csv_\uf8ff`)
  );

  // Apply single field filter
  let filterField = "";
  let filterValue = "";

  if (uid) {
    filterField = "person_nbr";
    filterValue = uid;
  } else if (firstName) {
    filterField = "first_name";
    filterValue = firstName.toUpperCase();
  } else if (lastName) {
    filterField = "last_name";
    filterValue = lastName.toUpperCase();
  } else if (agencyName) {
    filterField = "agency_name";
    filterValue = agencyName.toUpperCase();
  }

  if (filterField && filterValue) {
    firestoreQuery = query(
      firestoreQuery,
      where(filterField, ">=", filterValue),
      where(filterField, "<=", filterValue + "\uf8ff"),
      orderBy(filterField)
    );
  } else {
    firestoreQuery = query(firestoreQuery, orderBy("__name__"));
  }

  // Apply pagination
  if (currentPage > 1) {
    const previousPageQuery = query(
      firestoreQuery,
      limit((currentPage - 1) * size)
    );
    const previousPageSnapshot = await getDocs(previousPageQuery);
    const lastVisible =
      previousPageSnapshot.docs[previousPageSnapshot.docs.length - 1];
    firestoreQuery = query(firestoreQuery, startAfter(lastVisible));
  }

  firestoreQuery = query(firestoreQuery, limit(size));

  const snapshot = await getDocs(firestoreQuery);

  // Process and return data
  return snapshot.docs.map((doc) => {
    const docData = doc.data();
    return {
      agency_name: docData.agency_name,
      person_nbr: docData.person_nbr,
      first_name: docData.first_name,
      last_name: docData.last_name,
      start_date: docData.start_date,
      end_date: docData.end_date,
      separation_reason: docData.separation_reason,
    } as AgencyData;
  });
}
