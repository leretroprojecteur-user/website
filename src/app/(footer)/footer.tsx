import {
  faGithub,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function Footer() {
  return (
    <div>
      <br />
      <hr />
      <br />
      <div className="center" style={{ textAlign: "center" }}>
        <Link href="/newsletter">
          Abonnez-vous à notre newsletter hebdomadaire&nbsp;!
        </Link>
      </div>
      <br />
      <div style={{ textAlign: "center" }}>
        <a
          href="https://twitter.com/RetroProjecteur"
          style={{ fontSize: "30px" }}
          target="_blank"
        >
          <FontAwesomeIcon
            className="fa-icons"
            style={{ fontSize: "30px" }}
            icon={faTwitter}
          />
        </a>
        &nbsp;
        <a
          href="https://www.instagram.com/leretroprojecteur"
          style={{ fontSize: "30px" }}
          target="_blank"
        >
          <FontAwesomeIcon
            className="fa-icons"
            style={{ fontSize: "30px" }}
            icon={faInstagram}
          />
        </a>
        &nbsp;
        <a
          href="https://github.com/LeRetroProjecteur/website"
          className="fa fa-github"
          style={{ fontSize: "30px" }}
          target="_blank"
        >
          <FontAwesomeIcon
            className="fa-icons"
            style={{ fontSize: "30px" }}
            icon={faGithub}
          />
        </a>
        <br />
        Un problème sur le site&nbsp;?{" "}
        <a href="mailto:contact@leretroprojecteur.com">
          Signalez-le nous&nbsp;!
        </a>
      </div>
      <br />
      <footer>
        <div className="secret-link">
          <Link href="/admin/tous-les-films">©</Link> Le Rétro Projecteur
          2021–2023
        </div>
        <br />
        <i>
          «&nbsp;Pour le grand écran, pas la p&apos;tite lucarne&nbsp;!&nbsp;»
        </i>
      </footer>
      <br />
      <br />
    </div>
  );
}
