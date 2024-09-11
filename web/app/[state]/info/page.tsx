import React from "react";
import Link from "next/link";

const InfoPage = ({ params }: { params: { state: string } }) => {
  return (
    <div>
      <h1>info page for {params.state}</h1>
      <div>
        <button>
          <Link href={`/${params.state}/Data`}>data</Link>
        </button>
      </div>
    </div>
  );
};

export default InfoPage;
