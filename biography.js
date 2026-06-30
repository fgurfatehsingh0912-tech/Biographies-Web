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

    setTimeout(addTrackingToButtons, 15);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================================================
// 3. DUAL-COORDINATE PHYSICS INERTIA ENGINE (LERP TRACKING)
// ============================================================================
function addTrackingToButtons() {
    const buttons = document.querySelectorAll('.gemini-perfect-button');
    
    buttons.forEach(button => {
        if (button.dataset.trackingInitialized === "true") return;
        button.dataset.trackingInitialized = "true";

        let state = {
            targetX: 0, targetY: 0,
            colorX: 0, colorY: 0,
            maskX: 0, maskY: 0
        };

        const initialRect = button.getBoundingClientRect();
        state.targetX = initialRect.width / 2;
        state.targetY = initialRect.height / 2;
        
        state.colorX = state.targetX;
        state.colorY = state.targetY;
        state.maskX = state.targetX + 35; // Preset the rightward gap offset on boot
        state.maskY = state.targetY;

        button.addEventListener('mousemove', (e) => {
            const currentRect = button.getBoundingClientRect();
            const mouseX = e.clientX - currentRect.left;
            const mouseY = e.clientY - currentRect.top;

            state.targetX = mouseX;

            // EDGE-LOCKING: Snaps the Y-axis center perfectly to the active rim boundary line
            if (mouseY < currentRect.height / 2) {
                state.targetY = 0; 
            } else {
                state.targetY = currentRect.height; 
            }
        });

        // HIGH FREQUENCY ANIMATION TICK RATE LOOP
        function updateCoordinatesLoop() {
            // 1. Color coordinates glide closely behind the mouse pointer
            state.colorX += (state.targetX - state.colorX) * 0.08;
            state.colorY += (state.targetY - state.colorY) * 0.08;

            // 2. Mask coordinates lag with a dedicated horizontal offset (+35px to the right)
            const targetMaskX = state.targetX + 35;
            state.maskX += (targetMaskX - state.maskX) * 0.06; // Slower speed creates fluid inertia lag trail
            state.maskY += (state.targetY - state.maskY) * 0.08;

            // Pipeline calculations directly to the CSS engine mapping tags
            button.style.setProperty('--x', `${state.colorX}px`);
            button.style.setProperty('--y', `${state.colorY}px`);
            button.style.setProperty('--mask-x', `${state.maskX}px`);
            button.style.setProperty('--mask-y', `${state.maskY}px`);

            requestAnimationFrame(updateCoordinatesLoop);
        }
        
        requestAnimationFrame(updateCoordinatesLoop);
    });
}

// ============================================================================
// 4. MAIN WINDOW SYSTEM INITIALIZATION
// ============================================================================
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
