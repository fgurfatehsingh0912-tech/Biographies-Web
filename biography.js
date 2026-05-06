// 1. Combined Data List
const biographies = [
    { name: 'A. P. J. Abdul Kalam', gender: 'male', bio: 'Gurfateh Singh' },
    { name: 'Manmohan Singh', gender: 'male', bio: 'Gurfateh Singh' },
    { name: "John Smith", gender: "male", bio: "Gurfateh Singh" },
    { name: "Sarah Jenkins", gender: "male", bio: "Gurfateh Singh" },
    { name: "Michael Chen", gender: "male", bio: "Gurfateh Singh" },
    { name: "Emma Wilson", gender: "female", bio: "Emily Johnson" }
];

/**
 * Main function to render cards based on current filters
 */
function displayBios() {
    // We select these INSIDE the function so they are never null
    const bioContent = document.getElementById('bioContent');
    const searchInput = document.getElementById('searchInput');
    const activeFilter = document.querySelector('.filter-opt:checked');

    if (!bioContent) return; // Exit if the container isn't found

    const searchText = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeGender = activeFilter ? activeFilter.value : 'all';

    // Clear current cards
    bioContent.innerHTML = '';

    // Filter logic
    const filtered = biographies.filter(person => {
        const matchesGender = activeGender === 'all' || person.gender === activeGender;
        const matchesSearch = person.name.toLowerCase().includes(searchText) || 
                              person.bio.toLowerCase().includes(searchText);
        return matchesGender && matchesSearch;
    });

    // If no results, show a message
    if (filtered.length === 0) {
        bioContent.innerHTML = `<div class="col-12"><p class="text-muted text-center mt-5">No biographies found matching "${searchText}".</p></div>`;
        return;
    }

    // Generate HTML for each card
    filtered.forEach(person => {
        const cardHtml = `
            <div class="col-md-4 bio-card">
                <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <h5 class="card-title">${escapeHtml(person.name)}</h5>
                        <p class="card-text">${escapeHtml(person.bio)}</p>
                        <button type="button" class="btn btn-outline-primary btn-sm">Read More</button>
                    </div>
                </div>
            </div>
        `;
        bioContent.insertAdjacentHTML('beforeend', cardHtml);
    });
}

/**
 * Helper to prevent XSS attacks / display text safely
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Setup Event Listeners after the DOM is fully ready
 */
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-opt');

    // Listen for typing in search bar
    if (searchInput) {
        searchInput.addEventListener('input', displayBios);
    }

    // Listen for radio button changes
    filterButtons.forEach(btn => {
        btn.addEventListener('change', displayBios);
    });

    // Run once on load to show all cards initially
    displayBios();
});