import Link from "next/link";
import styles from "./Home.module.scss";

const availableStates = [
  "Arizona",
  "California",
  "Florida",
  "Georgia",
  "Illinois",
  "Maryland",
  "Ohio",
  "Oregon",
  "South Carolina",
  "Tennessee",
  "Texas",
  "Vermont",
  "Washington",
  "Wyoming",
  "Alaska",
  "Idaho",
  "Indiana",
  "Kentucky",
  "New Mexico",
  "North Carolina",
  "Utah",
  "West Virginia",
];

export default async function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <div className={styles.content}>
          {/* <Map data={data} availableStates={availableStates} /> */}
        </div>
        <div className={styles.textContainer}>
          <h1 className={styles.heading}>
            Peace Officer Standards and Training Data
          </h1>
          <p className={styles.description}>
            The data presented here was obtained through public records requests
            from Peace Officer Standards and Training (POST) datasets across 13
            states. The data contains information on police officer employment
            history, including officer name, department, and employment dates.
          </p>
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.stateContainer}>
          {availableStates.map((state) => (
            <Link key={state} href={`/${state}/Info`}>
              <button className={styles.stateButton}>{state}</button>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
