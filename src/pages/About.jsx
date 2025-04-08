import styles from "./About.module.css";

function About() {
  return (
    <div className={styles.about}>
      <h2 className={styles.heading}>About HolyCrap</h2>
      <div className={styles.content}>
        <p>
          HolyCrap is a platform for people to get rid of unwanted items from
          their homes. Instead of throwing things away, find someone who might
          want them!
        </p>
        <p>
          Our mission is to reduce waste and build community connections through
          the sharing of resources. One person's unwanted item could be exactly
          what someone else is looking for.
        </p>
        <p>
          Browse available items, offer your own unwanted things, and help
          create a more sustainable future.
        </p>
      </div>
    </div>
  );
}

export default About;
