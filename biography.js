// ============================================================================
// 1. DATA SOURCE ARRAY
// ============================================================================
const biographies = [
    { name: 'A. P. J. Abdul Kalam', gender: 'male', bio: 'Gurfateh Singh', link: 'apj.html'},
    { name: 'Manmohan Singh', gender: 'male', bio: 'Gurfateh Singh', link: 'Manmohan_Singh.html'},
    { name: "John Smith", gender: "male", bio: "Gurfateh Singh", link: 'John_Smith.html'},
    { name: "Sarah Jenkins", gender: "male", bio: "Gurfateh Singh", link: 'Sarah_Jenkins.html'},
    { name: "Michael Chen", gender: "male", bio: "Gurfateh Singh", link:'Micheal_Chen.html'},
    { name: "Emma Wilson", gender: "female", bio: "Emily Johnson", link: 'Emma_Wilson.html' }
];

// ============================================================================
// 2. BIOGRAPHY CARD GENERATION ENGINE
// ============================================================================
function displayBios() {
    const bioContent = document.getElementById('bioContent');
    const searchInput = document.getElementById('searchInput');
    const activeFilter = document.querySelector('.filter-opt:checked');

    if (!bioContent) return;

    // Standardize query text data to safely support string operations
    const searchText = searchInput ? String(searchInput.value).toLowerCase().trim() : '';
    const activeGender = activeFilter ? activeFilter.value : 'all';

    // Reset old canvas contents layout before appending fresh query blocks
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

    // TIMING DELAY FIX: Allows the browser engine to fully draw cards into view before running tracking logic
    setTimeout(addTrackingToButtons, 15);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================================================
// 3. ASYMMETRIC SMOOTH PHYSICS ENGINE (LERP + EDGE-LOCKING)
// ============================================================================
function addTrackingToButtons() {
    const buttons = document.querySelectorAll('.gemini-perfect-button');
    
    buttons.forEach(button => {
        // Prevent duplicate process loops from attaching to the exact same button DOM nodes
        if (button.dataset.trackingInitialized === "true") return;
        button.dataset.trackingInitialized = "true";

        let state = {
            targetX: 0, targetY: 0,
            currentX: 0, currentY: 0
        };

        // Center coordinates safely on window bootups to prevent visual edge snaps
        const initialRect = button.getBoundingClientRect();
        state.targetX = initialRect.width / 2;
        state.targetY = initialRect.height / 2;
        state.currentX = state.targetX;
        state.currentY = state.targetY;

        button.addEventListener('mousemove', (e) => {
            const currentRect = button.getBoundingClientRect();
            const mouseX = e.clientX - currentRect.left;
            const mouseY = e.clientY - currentRect.top;

            // X-Axis tracks the mouse pointer natively
            state.targetX = mouseX;

            // EDGE-LOCKING CONDITIONALS:
            // Forces the target coordinate to jump to top or bottom borders automatically
            if (mouseY < currentRect.height / 2) {
                state.targetY = 0; // Stick to the top edge line if cursor hovers top half
            } else {
                state.targetY = currentRect.height; // Stick to the bottom edge line
            }
        });

        // HIGH FREQUENCY ENGINE LOOP: Runs smoothly matching display refresh rates (60Hz-120Hz+)
        function updateCoordinatesLoop() {
            /* 
               THE INTERPOLATION INERTIA SLOPE (0.07)
               - Covers 7% of remaining path gaps per screen frame refresh.
               - Delivers that characteristic slow, rich, authentic Google AI fluid drag feel.
            */
            state.currentX += (state.targetX - state.currentX) * 0.07;
            state.currentY += (state.targetY - state.currentY) * 0.07;

            // Pipeline calculations straight back to CSS variables mapping targets
            button.style.setProperty('--x', `${state.currentX}px`);
            button.style.setProperty('--y', `${state.currentY}px`);

            requestAnimationFrame(updateCoordinatesLoop);
        }
        
        requestAnimationFrame(updateCoordinatesLoop);
    });
}

// ============================================================================
// 4. MAIN WINDOW LIFE-CYCLE SYSTEM INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-opt');

    // Live search indexing filter handlers
    if (searchInput) {
        searchInput.addEventListener('input', displayBios);
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('change', displayBios);
    });

    // Generate layout grid metrics on window bootup sequence
    displayBios();
});

// Guarded sidebar off-canvas click listeners to prevent null-reference runtime exceptions
document.addEventListener("DOMContentLoaded", () => {
    const filterBtn = document.getElementById("filter-btn");
    const filterMenu = document.getElementById("filter-menu");

    if (filterBtn && filterMenu) {
        filterBtn.addEventListener("click", () => {
            filterMenu.classList.toggle("open");
        });
    }
});
