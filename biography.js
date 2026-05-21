const biographies = [
    { name: 'A. P. J. Abdul Kalam', gender: 'male', bio: 'Gurfateh Singh' },
    { name: 'Manmohan Singh', gender: 'male', bio: 'Gurfateh Singh' },
    { name: "John Smith", gender: "male", bio: "Gurfateh Singh" },
    { name: "Sarah Jenkins", gender: "male", bio: "Gurfateh Singh" },
    { name: "Michael Chen", gender: "male", bio: "Gurfateh Singh" },
    { name: "Emma Wilson", gender: "female", bio: "Emily Johnson" }
];

function displayBios() {
    // We select these INSIDE the function so they are never null
    const bioContent = document.getElementById('bioContent');
    const searchInput = document.getElementById('searchInput');
    const activeFilter = document.querySelector('.filter-opt:checked');

    if (!bioContent) return;

    const searchText = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeGender = activeFilter ? activeFilter.value : 'all';

    bioContent.innerHTML = '';

    const filtered = biographies.filter(person => {
        const matchesGender = activeGender === 'all' || person.gender === activeGender;
        const matchesSearch = person.name.toLowerCase().includes(searchText) || 
                              person.bio.toLowerCase().includes(searchText);
        return matchesGender && matchesSearch;
    });

    if (filtered.length === 0) {
        bioContent.innerHTML = `<div class="col-12"><p class="text-muted text-center mt-5">No biographies found matching "${searchText}".</p></div>`;
        return;
    }

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

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-opt');

    if (searchInput) {
        searchInput.addEventListener('input', displayBios);
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('change', displayBios);
    });

    displayBios();
});
