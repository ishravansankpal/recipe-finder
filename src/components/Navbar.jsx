
function Navbar({ currentPage, onNavigate }) {
  const links = [
    { name: "Home", page: "home" },
    { name: "Explore Recipes", page: "explore" },
    { name: "Favourites", page: "favourites" },
    { name: "About", page: "about" },
  ];

  return (
    <nav className="navbar">
      <h1 className="logo" onClick={() => onNavigate("home")}>
        Recipe Finder
      </h1>

      <ul className="nav-links">
        {links.map((link) => (
          <li key={link.page}>
            <button
              className={currentPage === link.page ? "nav-btn active" : "nav-btn"}
              onClick={() => onNavigate(link.page)}
            >
              {link.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
