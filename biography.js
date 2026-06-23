const biographies = [
    { name: 'A. P. J. Abdul Kalam', gender: 'male', bio: 'Gurfateh Singh', link: 'apj.html'},
    { name: 'Manmohan Singh', gender: 'male', bio: 'Gurfateh Singh', link: 'Manmohan_Singh.html'},
    { name: "John Smith", gender: "male", bio: "Gurfateh Singh", link: 'John_Smith.html'},
    { name: "Sarah Jenkins", gender: "male", bio: "Gurfateh Singh", link: 'Sarah_Jenkins.html'},
    { name: "Michael Chen", gender: "male", bio: "Gurfateh Singh", link:'Micheal_Chen.html'},
    { name: "Emma Wilson", gender: "female", bio: "Emily Johnson", link: 'Emma_Wilson.html' }
];

function displayBios() {
    const bioContent = document.getElementById('bioContent');
    const searchInput = document.getElementById('searchInput');
    const activeFilter = document.querySelector('.filter-opt:checked');

    if (!bioContent) return;

    // Fixed: Standardized to safely read value strings from Material Web Components
    const searchText = searchInput ? String(searchInput.value).toLowerCase().trim() : '';
    const activeGender = activeFilter ? activeFilter.value : 'all';

    bioContent.innerHTML = '';

    const filtered = biographies.filter(person => {
        const matchesGender = activeGender === 'all' || person.gender === activeGender;
        const matchesSearch = person.name.toLowerCase().includes(searchText) || 
                              person.bio.toLowerCase().includes(searchText);
        return matchesGender && matchesSearch;
    });

    if (filtered.length === 0) {
        bioContent.innerHTML = `<div class="col-12 text-center text-light mt-5"><p>No biographies found matching "${escapeHtml(searchText)}".</p></div>`;
        return;
    }

    filtered.forEach(person => {
        const cardHtml = `
            <div class="col-md-4 bio-card">
                <div class="card shadow-sm h-100 bg-dark text-light border-secondary">
                    <div class="card-body">
                        <h5 class="card-title">${escapeHtml(person.name)}</h5>
                        <p class="card-text">${escapeHtml(person.bio)}</p>
                        <form action="${escapeHtml(person.link)}">
                        <button class="gemini-perfect-button" id="gemini-btn">
  <span class="btn-text">Read Biography</span>
</button>
</form>
                    </div>
                </div>
            </div>
        `;
        bioContent.insertAdjacentHTML('beforeend', cardHtml);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-opt');

    if (searchInput) {
        // Listening to the 'input' event correctly updates the layout on every keystroke
        searchInput.addEventListener('input', displayBios);
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('change', displayBios);
    });

    // Generate initial layout display
    displayBios();
});

// FIXED CRASH: Safely query elements to avoid breaking the script environment
document.addEventListener("DOMContentLoaded", () => {
  const filterBtn = document.getElementById("filter-btn");
  const filterMenu = document.getElementById("filter-menu");

  // This check prevents "Cannot read properties of null" crashes if the buttons aren't in the HTML layout
  if (filterBtn && filterMenu) {
    filterBtn.addEventListener("click", () => {
      filterMenu.classList.toggle("open");
    });
  }
});
const btn = document.getElementById('gemini-btn');

btn.addEventListener('mousemove', (e) => {
  const rect = btn.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Feeds tracking coordinates directly back into the CSS variables
  btn.style.setProperty('--x', `${x}px`);
  btn.style.setProperty('--y', `${y}px`);
});
