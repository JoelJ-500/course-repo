document.addEventListener("DOMContentLoaded", async () => {
     //get saved courses
    const response = await fetch('http://localhost:3000/courses/saved', {
      method: 'GET',
      credentials: 'include'
    });
    const courses = await response.json();

    const username = localStorage.getItem('cr_user');

    const storageKey = `recent_viewed_${username}`;
  
    const rawData = localStorage.getItem(storageKey);
    const recentCourses = rawData ? JSON.parse(rawData) : [];

    const recentTable = document.querySelector('#recent');
    recentCourses.forEach(course => {
        const row = document.createElement('div');
        row.classList.add('row');

        row.innerHTML = `
        <div>
            <span class="course-code">
                <a href="course.html?id=${course.course_id}">${course.course_code}</a>
            </span> - 
            <span style="font-style:italic">${course.professor_name}</span>
        </div>
        <div class="course-title">${course.course_title}</div>
        `;

        recentTable.appendChild(row);
    });

    const savedTable = document.querySelector('#saved');
    courses.data.forEach(async course => {

        const course_response = await fetch(`http://localhost:3000/courses?course_id=${course.course_id}`, {
            method: 'GET',
            credentials: 'include'
        })

        const course_data = await course_response.json()

        const row = document.createElement('div');
        row.classList.add('row');

        row.innerHTML = `
        <div>
            <span class="course-code">
                <a href="course.html?id=${course_data.data.course_id}">${course_data.data.course_code}</a>
            </span> - 
            <span style="font-style:italic">${course_data.data.professor_name}</span>
        </div>
        <div class="course-title">${course_data.data.course_title}</div>
        `;

        savedTable.appendChild(row);
    });

})