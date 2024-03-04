import "./Homepage.css";
import { Link } from "react-router-dom";

function Homepage() {

  return (
      <div className="Homepage">
        <div className="container text-center">
          <h1 className="mb-4 font-weight-bold">MusicSphere</h1>
          <p className="lead">Harmony Awaits in MusicSphere.</p>

        <div className="button-container">
          <Link className="btn btn-primary" to="/searchArtists" style={{ marginRight: '10px'}}>Artists</Link>
          <Link className="btn btn-primary" to="/searchAlbums" style={{ marginRight: '10px'}}>Albums</Link>
          <Link className="btn btn-primary" to="/searchSongs" >Songs</Link>
        </div>
        </div>
      </div>
  );
}

export default Homepage;
