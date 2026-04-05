document.addEventListener("DOMContentLoaded", async () => {

    const course_response = await fetch(`http://localhost:3000/courses/saved`, {
      method: 'GET',
      credentials: 'include',
    });
    const courses = await course_response.json();
    console.log(courses.data);

    const courseTable = document.getElementById('saved-courses-body');
    
    courseTable.innerHTML = '';

    courses.data.forEach(async item => {
        console.log(item)

        try {
            const response = await fetch(`http://localhost:3000/courses?course_id=${item.course_id}`, {
                method: 'GET',
                credentials: 'include',
            });
            
            const courseData = await response.json();

            const savedDate = new Date(item.saved_at);
            const formattedDate = savedDate.toLocaleDateString('en-GB').replace(/\//g, '-');

            const row = `
                <tr>
                    <td><a href="course.html?id=${courseData.data.course_id}">${courseData.data.course_code}</a></td>
                    <td>${courseData.data.course_title}</td>
                    <td class="date-col">${formattedDate}</td>
                </tr>
            `;

            courseTable.insertAdjacentHTML('beforeend', row);

        } catch (error) {
            console.error(`Error fetching course ${item.course_id}:`, error);
        }
    });


    const files_response = await fetch(`http://localhost:3000/files/saved`, {
      method: 'GET',
      credentials: 'include',
    });
    const files = await files_response.json();
    console.log(files.data);

    const fileTable = document.getElementById('saved-files-body');
    
    fileTable.innerHTML = '';

    files.data.forEach(async item => {
        console.log(item)

        try {
            const response = await fetch(`http://localhost:3000/files?file_id=${item.file_id}`, {
                method: 'GET',
                credentials: 'include',
            });
            
            const fileData = await response.json();

            const course_response = await fetch(`http://localhost:3000/courses?course_id=${item.course_id}`, {
                method: 'GET',
                credentials: 'include',
            });

            const courseData = await course_response.json();

            const savedDate = new Date(item.saved_at);
            const formattedDate = savedDate.toLocaleDateString('en-GB').replace(/\//g, '-');

            const row = `
                <tr>
                    <td><a href="http://localhost:3000/files/${fileData.data.file_id}">${fileData.data.display_name}</a></td>
                    <td>${fileData.data.description}</td>
                    <td><a href="course.html?id=${courseData.data.course_id}">${courseData.data.course_code}</a></td>
                    <td class="date-col">${formattedDate}</td>
                </tr>
            `;

            fileTable.insertAdjacentHTML('beforeend', row);

        } catch (error) {
            console.error(`Error fetching course ${item.course_id}:`, error);
        }
    });
});

