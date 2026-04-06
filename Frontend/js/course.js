document.addEventListener("DOMContentLoaded", async () => {
    //this gets the id from the url e.g., http://127.0.0.1:8080/course.html?id=1
    const query_string = window.location.search;
    const url_params = new URLSearchParams(query_string);

    const course_id = url_params.get('id');

    //get course information by id
    const course_response = await fetch(`http://localhost:3000/courses?course_id=${course_id}`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!course_response.ok) {
        alert("Course no longer exists");
        window.location.href = "index.html";
    }

    const courses = await course_response.json();

    //add course to recently viewed

    if (course_response.ok) {
        const username = localStorage.getItem('cr_user');
        
        const storageKey = `recent_viewed_${username}`;

        const rawData = localStorage.getItem(storageKey);
        let history = rawData ? JSON.parse(rawData) : [];

        history = history.filter(course => course.course_id !== courses.data.course_id);

        history.unshift(courses.data);
        
        if (history.length > 5) {
            history = history.slice(0, 5);
        }

        localStorage.setItem(storageKey, JSON.stringify(history));
    }
    
    
    //get course files
    const files_response = await fetch(`http://localhost:3000/courses/files?course_id=${course_id}`, {
        method: 'GET',
        credentials: 'include',
    });
    const files = await files_response.json();

    //handle the file uploading
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const uploadForm = document.getElementById('uploadForm');

    browseBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        fileNameDisplay.textContent = fileInput.files[0] ? fileInput.files[0].name : "No file chosen";
    });

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(uploadForm);

        formData.append("course_id", course_id);

        try {
            const response = await fetch('http://localhost:3000/files/upload', {
            method: 'POST',
            body: formData,
            credentials: 'include',
            });

            if (response.ok) {
            const result = await response.json();
            alert('Upload successful!');
            uploadForm.reset();
            location.reload();

            } else {
            alert('Upload failed.');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('An error occurred during upload.');
        }
    });

    const course_title = document.querySelector(".course-title");
    const professor = document.querySelector("#prof");
    const university = document.querySelector("#uni");
    const date_created = document.querySelector("#date");

    course_title.innerHTML = `${courses.data.course_code} - <span id="title" style="font-weight:500">${courses.data.course_title}</span>`;
    professor.textContent = courses.data.professor_name;
    university.textContent = courses.data.university_name;
    date_created.textContent = new Date(courses.data.last_updated_at).toLocaleDateString();

    const bookmark = "M12,17,5,21V4A1,1,0,0,1,6,3H18a1,1,0,0,1,1,1V21Z";

    const saved_course_response = await fetch(`http://localhost:3000/courses/saved`, {
        method: 'GET',
        credentials: 'include'
    });

    const saved_courses = await saved_course_response.json();

    const bookmark_element = document.querySelector("#bookmark");
    const bookmark_svg = document.querySelector(".bookmark-icon");
    const bookmark_button = document.querySelector(".bookmark-btn");

    const isSaved = saved_courses.data.find(item => item.course_id == course_id)

    if (isSaved) {
        bookmark_svg.id = "bookmark-filled";
        
    }

    bookmark_button.addEventListener('click', async () => {
                try {
                const response = await fetch('http://localhost:3000/courses/save', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ course_id: course_id }),
                    credentials: 'include',
                });

                if (response.ok) {
                    const responseJson = await response.json()
                    
                    if (responseJson.data[0].id) {
                        bookmark_svg.id = "bookmark-filled";
                    } else {
                        bookmark_svg.id = "bookmark";
                    }      
                    
                } else {
                    console.error('Server error:', response.statusText);
                }
                } catch (error) {
                console.error('Network error:', error);
                }
        });

    const checkmark = "M10,18a1,1,0,0,1-.71-.29l-5-5a1,1,0,0,1,1.42-1.42L10,15.59l8.29-8.3a1,1,0,1,1,1.42,1.42l-9,9A1,1,0,0,1,10,18Z"
    const plus = "M12,20a1,1,0,0,1-1-1V13H5a1,1,0,0,1,0-2h6V5a1,1,0,0,1,2,0v6h6a1,1,0,0,1,0,2H13v6A1,1,0,0,1,12,20Z"

    const saved_files_response = await fetch(`http://localhost:3000/files/saved`, {
        method: 'GET',
        credentials: 'include',
    });
    const saved_files = await saved_files_response.json();

    files.data.forEach(file => {
        const dateObj = new Date(file.uploaded_at);
        const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${dateObj.getFullYear()}`;

        let tableSelector = "";
        let tableViewSelector = "";
        let sectionSelector = "";
        
        switch (file.category) {
            case "outline":
                tableSelector = '#outline'; 
                sectionSelector = "#outline_section"
                break;
            case 'midterm_real':
                tableSelector = '#real_midterm';
                tableViewSelector = '.real_midterm';
                sectionSelector = '#midterm';
                break;
            case 'midterm_mock':
                tableSelector = '#mock_midterm';
                tableViewSelector = '.mock_midterm';
                sectionSelector = '#midterm'
                break;
            case 'final_mock':
                tableSelector = '#mock_final';
                tableViewSelector = '.mock_final';
                sectionSelector = '#final';
                break;
            case 'final_real':
                tableSelector = '#real_final';
                tableViewSelector = '.mock_final';
                sectionSelector = '#final'
                break;
            case 'misc':
                tableSelector = '#misc';
                sectionSelector = '#misc_section'
                break;
        }

        const savedRecord = saved_files.data.find(item => item.file_id === file.file_id);

        let symbol = plus;

        if (savedRecord) {
            symbol = checkmark;
        }

        const targetTbody = document.querySelector(tableSelector);

        if (targetTbody) {
            const row = document.createElement('tr');
            
            let htmlContent = `
                <td><a href="http://localhost:3000/files/${file.file_id}">${file.display_name}</a></td>
                ${file.category === 'misc' ? `<td>${file.description}</td>` : ''}
                <td class="date-col">${formattedDate}</td>
                <td class="save-col">
                    <button class="add-btn-${file.file_id}" title="Add ${file.display_name}" aria-label="Add file" id="save-button">
                        <span class="icon green" aria-hidden="true">
                            <svg viewBox="0 0 24 24"><path class="icon-path-${file.file_id}" d="${symbol}"/></svg>
                        </span>
                    </button>
                </td>
            `;
            
            row.innerHTML = htmlContent;
            targetTbody.appendChild(row);
        }

        const addButton = document.querySelector(`.add-btn-${file.file_id}`);
        const iconPath = document.querySelector(`.icon-path-${file.file_id}`);

        addButton.addEventListener('click', async () => {
                try {
                const response = await fetch('http://localhost:3000/files/save', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ file_id: file.file_id }),
                    credentials: 'include',
                });

                if (response.ok) {
                    const responseJson = await response.json()
                    
                    if (responseJson.data[0].id) {
                    iconPath.setAttribute('d', checkmark);
                    } else {
                    iconPath.setAttribute('d', plus);
                    }      
                    
                } else {
                    console.error('Server error:', response.statusText);
                }
                } catch (error) {
                console.error('Network error:', error);
                }
        });

        if (tableViewSelector) {
            document.querySelector(tableViewSelector).style.display = "block";
        }
        if (sectionSelector) {
            document.querySelector(sectionSelector).style.display = "block";
        }

    });  

    

});