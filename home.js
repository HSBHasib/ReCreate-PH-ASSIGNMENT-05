// Select all the necessary Element
const allButton = document.getElementById('allBtn');
const openButton = document.getElementById('openBtn');
const closedButton = document.getElementById('closedBtn');
const cardContainer = document.getElementById('card-container');
const issuesCount = document.getElementById('issuesCount');
const loading = document.getElementById('loading');
const searchInput = document.getElementById('searchInput');

const loadIssues = async () => {
    let res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
    let data = await res.json();
    allIssues = data.data;
    displayCard(allIssues);
    displayIssuesCount(allIssues);
}

const handleSearchInput = async () => {
    const searchText = searchInput.value.trim();
    
    if(searchText === "") {
        loadIssues();
        return;
    }

    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`);
    const data = await res.json();
    displayCardClickingBybutton(data.data);
}

function displayCardClickingBybutton(searchResults) {
    // Check if results exist
    if (!searchResults || searchResults.length === 0) {
        cardContainer.innerHTML = `
            <div class="col-span-full text-center py-20">
                <h2 class="text-2xl font-bold text-gray-400">Result Not Found!</h2>
            </div>
        `;
        issuesCount.textContent = 0;
    } else {
        displayCard(searchResults);
        displayIssuesCount(searchResults);
    }
}

//Search Button
searchBtn.addEventListener('click', handleSearchInput);

// This code works when user just input somotime and click enter btn
searchInput.addEventListener('keydown', (dets) => {
    if (dets.key === 'Enter') {
        handleSearchInput();
    }
});

const displayCard = (dets) => {
    cardContainer.innerHTML = "";

    dets.forEach(elem => {
        const div = document.createElement('div');
        
        const borderColor = elem.status.toLowerCase() === 'open' ? 'border-t-[#00A96E]' : 'border-t-[#A855F7]'; 
        div.className = `${borderColor} border-t-4 rounded-xl flex flex-col h-full`;
        
        // Modal if user click on any card than it open
        div.onclick = () => loadSingleIssue(elem.id);

        div.innerHTML = `
            <div class="rounded-xl flex flex-col h-full shadow-sm bg-white">
                <div class="group border border-gray-100 rounded-t-lg p-5 space-y-2 flex-grow">                
                    <div class="flex justify-between items-start">
                        <div class="rounded-full">
                            <img src="${elem.status.toLowerCase() === 'open' ? './assets/Open-Status.png' : './assets/closed-status.png'}" alt="${elem.status}-img">
                        </div>

                        <span class="tracking-wide px-7 py-1 border text-[13px] font-medium rounded-full uppercase
                            ${elem.priority.toUpperCase() === 'HIGH' ? 'bg-red-50 text-red-600 border-red-100' : 
                            elem.priority.toUpperCase() === 'MEDIUM' ? 'bg-[#FFF6D1] text-[#E4930A] border-[#FFF6D1]' :'bg-[#EEEFF2] text-[#9096A1] border-[#EEEFF2]'}">
                            ${elem.priority.toUpperCase()}
                        </span>
                    </div>
                
                    <h3 class="font-bold text-[15px] text-[#1F2937] leading-tight line-clamp-2">${elem.title}</h3>
                    <p class="text-[13px] text-[#64748B] line-clamp-3 leading-relaxed font-medium">${elem.description}</p>
                    
                    <div class="flex flex-wrap gap-2 pt-2">
                        ${elem.labels.map(label => `
                            <span class="px-2 py-1 text-[9px] font-bold rounded-full border uppercase 
                                ${label.toLowerCase() === 'bug' ? 'bg-[#FFF1F2] text-[#E11D48] border-[#FFE4E6]' : 'bg-[#FFFBEB] text-[#D97706] border-[#FEF3C7]'}"> 
                                <i class="fa-solid ${label.toLowerCase() === 'bug' ? 'fa-robot' : 'fa-life-ring'} mr-1"></i> 
                                ${label}
                            </span>
                        `).join('')}
                    </div>
                </div>
                <div class="border-t border-gray-200 bg-gray-50/30 rounded-b-lg p-4 space-y-1">
                    <div class="text-[14px] font-medium text-[#64748B]">#${elem.id} by ${elem.author}</div>
                    <div class="text-[14px] font-medium text-[#64748B]">${new Date(elem.createdAt).toLocaleDateString()}</div>
                </div>
            </div>
        `
        cardContainer.append(div)
    });
    
} 

const filterIssues = (status, activeBtn) => {
    [allButton, openButton, closedButton].forEach(btn => {
        btn.classList.remove('bg-[#4A00FF]', 'text-white');
        btn.classList.add('text-gray-600', 'border-gray-300', 'border-[1.5px]', 'border-gray-300');
    });

    // add active class style on click btn
    activeBtn.classList.add('bg-[#4A00FF]', 'text-white');
    activeBtn.classList.remove('text-gray-600', 'border-gray-300');

    // Filtering the data
    const filtered = status === 'all' ? allIssues : allIssues.filter(item => item.status.toLowerCase() === status);
    displayCard(filtered);
    displayIssuesCount(filtered);
}

// 4. Events
allButton.addEventListener('click', () => filterIssues('all', allButton));
openButton.addEventListener('click', () => filterIssues('open', openButton));
closedButton.addEventListener('click', () => filterIssues('closed', closedButton));

const displayIssuesCount = (dets) => {
    issuesCount.textContent = dets.length;
}

const loadSingleIssue = async (id) => {
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
    const data = await res.json();
    displayModal(data.data)

    const modal = document.getElementById('my_modal_5');
    modal.showModal();
};

function displayModal(issue) {
    const modal = document.getElementById('my_modal_5');    
    modal.innerHTML = `
    <div class="modal-box max-w-2xl p-8 bg-white rounded-2xl shadow-2xl overflow-hidden relative">
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
        </form>

        <h2 class="text-[24px] font-bold text-[#1F2937] mb-2">${issue.title}</h2>
        
        <div class="flex items-center gap-3 mb-6">
            <span class="${issue.status.toLowerCase() === 'open' ? 'bg-[#00A96E]' : 'bg-[#A855F7]'} text-white text-[12px] px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 uppercase">
                ${issue.status}
            </span>
            <p class="text-[#64748B] text-[13px] space-x-2">
                <span><big>•</big> Opened by ${issue.author}</span>
                <span><big>•</big> ${new Date(issue.createdAt).toLocaleDateString()}</span>
            </p>
        </div>

        <div class="flex gap-2 mb-6">
            ${issue.labels.map(label => `
                <span class="px-3 py-1 ${label.toLowerCase() === 'bug' ? 'bg-[#FFF1F2] text-[#E11D48] border-[#FFE4E6]' : 'bg-[#FFFBEB] text-[#D97706] border-[#FEF3C7]'} text-[12px] font-medium rounded-full border uppercase flex items-center">
                    <i class="fa-solid ${label.toLowerCase() === 'bug' ? 'fa-robot' : 'fa-life-ring'} mr-1.5"></i> ${label}
                </span>
            `).join('')}
        </div>

        <p class="text-[#64748B] text-[15px] leading-relaxed mb-10">${issue.description}</p>

        <div class="flex justify-start gap-24 mb-4 bg-[#F8FAFC] p-5">
            <div>
                <p class="text-[#64748B] text-[14px] mb-1 font-medium">Assignee:</p>
                <p class="font-bold text-[#1F2937] text-[14px] leading-none">${issue.author}</p>
            </div>
            <div>
                <p class="text-[#64748B] text-[14px] mb-1 font-medium">Priority:</p>
                <span class="bg-[#EF4444] text-white text-[11px] font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide">
                    ${issue.priority}
                </span>
            </div>
        </div>

        <div class="modal-action pt-6 border-t border-gray-100">
            <form method="dialog">
                <button class="bg-[#4F00FF] hover:bg-[#3b00cc] text-white px-8 py-2.5 rounded-lg font-bold text-sm transition-all shadow-md shadow-blue-100">
                    Close
                </button>
            </form>
        </div>
    </div>
    `;
}

loadIssues();