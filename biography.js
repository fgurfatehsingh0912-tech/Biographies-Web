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
                    <div class="card-body d-flex flex-column justify-content-between">
                        <div>
                            <h5 class="card-title">${escapeHtml(person.name)}</h5>
                            <p class="card-text">${escapeHtml(person.bio)}</p>
                        </div>
                        <form action="${escapeHtml(person.link)}" class="mt-3">
                            <button type="submit" class="gemini-perfect-button">
                                <span class="btn-text">Read Biography</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        bioContent.insertAdjacentHTML('beforeend', cardHtml);
    });

    addTrackingToButtons();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// THE PHYSICS ENGINE: Drives the smooth fluid transition loop
function addTrackingToButtons() {
    const buttons = document.querySelectorAll('.gemini-perfect-button');
    
    buttons.forEach(button => {
        // Create isolated state objects for each separate layout button card
        let state = {
            targetX: 0, targetY: 0,
            currentX: 0, currentY: 0,
            isHovered: false
        };

        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            state.targetX = e.clientX - rect.left;
            state.targetY = e.clientY - rect.top;
            state.isHovered = true;
        });

        button.addEventListener('mouseenter', () => {
            state.isHovered = true;
        });

        button.addEventListener('mouseleave', () => {
            state.isHovered = false;
        });

        // High frequency animation frame loop ticks coordinates smoothly
        function updateCoordinatesLoop() {
            if (state.isHovered) {
                // THE SMOOTH LERP FACTOR (0.08 = 8% of total distance covered per frame)
                // Lowering this number makes it glide slower and heavier!
                state.currentX += (state.targetX - state.currentX) * 0.08;
                state.currentY += (state.targetY - state.currentY) * 0.08;

                button.style.setProperty('--x', `${state.currentX}px`);
                button.style.setProperty('--y', `${state.currentY}px`);
            }
            requestAnimationFrame(updateCoordinatesLoop);
        }
        
        // Boot animation tracking ticks
        requestAnimationFrame(updateCoordinatesLoop);
    });
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
