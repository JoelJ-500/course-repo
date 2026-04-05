document.addEventListener("DOMContentLoaded", async () => {

    const universities_response = await fetch(`http://localhost:3000/courses/universities`, {
      method: 'GET',
      credentials: 'include',
    });

    const universities = await universities_response.json();

    const university_selector = document.querySelector("#universities");

    universities.data.forEach(university => {
      const option = document.createElement("option");
      option.value = university.university_name;
      option.textContent = university.university_name;

      university_selector.appendChild(option);
    })


    const url = new URL(window.location.href);

    university_selector.addEventListener('change', (event) => {
      const selectedUniversity = event.target.value;


      if (selectedUniversity) {
        url.searchParams.set('university', selectedUniversity);
      } else {
        url.searchParams.delete('university');
      }

      window.location.href = url.toString();

    });

    const sort_selector = document.querySelector("#sort");
    sort_selector.addEventListener("change", (event) => {
        url.searchParams.set("sortBy", sort_selector.value);
        window.location.href = url.toString();
    });

    const query_string = window.location.search;
    const url_params = new URLSearchParams(query_string);

    const search_term = url_params.get('q');

    const resultsSearch = qs('[data-results-search]');
    resultsSearch.value = search_term;

    let search_url = `http://localhost:3000/courses/search?q=${search_term}`
    
    const university = url_params.get('university');
    
    if (university) {
      search_url = search_url + `&university=${university}`
      university_selector.value = university;
    }

    const sortBy = url_params.get("sortBy");

    if (sortBy) {
        search_url = search_url + `&sortBy=${sortBy}`
        sort_selector.value = sortBy;
    }

    const search_response = await fetch(search_url, {
      method: 'GET',
      credentials: 'include',
    });
    const search_results = await search_response.json();

    const saved_response = await fetch('http://localhost:3000/courses/saved', {
      method: 'GET',
      credentials: 'include'
    });

    const saved = await saved_response.json()

    const resultsContainer = document.querySelector('.results');

    checkmark = "M10,18a1,1,0,0,1-.71-.29l-5-5a1,1,0,0,1,1.42-1.42L10,15.59l8.29-8.3a1,1,0,1,1,1.42,1.42l-9,9A1,1,0,0,1,10,18Z"
    plus = "M12,20a1,1,0,0,1-1-1V13H5a1,1,0,0,1,0-2h6V5a1,1,0,0,1,2,0v6h6a1,1,0,0,1,0,2H13v6A1,1,0,0,1,12,20Z"

    search_results.data.forEach(course => {

      const savedRecord = saved.data.find(item => item.course_id === course.course_id);

      let symbol = plus;

      if (savedRecord) {
        symbol = checkmark;
      }
      // Create a wrapper div
      const resultItem = document.createElement('div');
      resultItem.classList.add('result-item');

      // Inject the internal HTML structure using template literals
      resultItem.innerHTML = `
        <div>
          <div class="name">${course.course_code}</div>
          <div class="desc">${course.course_title}</div>
          <div class="meta">
            <span class="muted">${course.university_name}</span>
            <a href="course.html?id=${course.course_id}">View Content</a>
          </div>
        </div>
        <div class="add">
          <button class="add-btn" title="Add ${course.course_code}" aria-label="Add course">
            <span class="icon green" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path class="icon-path" d="${symbol}"/></svg>
            </span>
          </button>
        </div>
      `;

      // Append the finished item to your container
      resultsContainer.appendChild(resultItem);
    
      const addButton = resultItem.querySelector('.add-btn');
      const iconPath = resultItem.querySelector('.icon-path');

      addButton.addEventListener('click', async () => {
        try {
          // 1. Make the POST request
          const response = await fetch('http://localhost:3000/courses/save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ course_id: course.course_id }),
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
    });
});