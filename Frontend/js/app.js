(function(){
  function qs(sel, root=document){return root.querySelector(sel)}
  function qsa(sel, root=document){return Array.from(root.querySelectorAll(sel))}

  // Login page submit
  const loginForm = qs('[data-login-form]');
  if(loginForm){
    loginForm.addEventListener('submit', async (e)=>{
      e.preventDefault();

      const formData = new FormData(loginForm);

      const payload = Object.fromEntries(formData.entries());

      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      if (response.status === 200) {
        const userData = await response.json();
        localStorage.setItem('cr_user', userData.data[0].username);
        window.location.href = './index.html';
      } else {
        const data = await response.json();
        document.querySelector('#error').style.display = 'block';
        document.querySelector('#error').textContent = data.message;
      }
    });
  }

  // Sign Up page submit
  const registerForm = qs('[data-signup-form]');
  if(registerForm){
    registerForm.addEventListener('submit', async (e)=>{
      e.preventDefault();

      const formData = new FormData(registerForm);

      const payload = Object.fromEntries(formData.entries());

      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      if (response.status === 200) {
        const userData = await response.json();
        localStorage.setItem('cr_user', userData.data[0].username);
        window.location.href = './login.html';
      } else {
        const data = await response.json();
        document.querySelector('#error').style.display = 'block';
        document.querySelector('#error').textContent = data.message;
        console.log(data.message);
      }
    });
  }

  // Search: on enter, go to search results
  const homeSearch = qs('[data-home-search]');
  if(homeSearch){
    homeSearch.addEventListener('keydown', (e)=>{
      if(e.key==='Enter'){
        const q = homeSearch.value.trim();
        window.location.href = `search.html?q=${encodeURIComponent(q)}`;
      }
    });
  }
  const resultsSearch = qs('[data-results-search]');
  if(resultsSearch){
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || 'Example Search';
    resultsSearch.value = q;
  }

  // Course difficulty star control
  const starWrap = qs('[data-stars]');
  if(starWrap){
    const stars = qsa('.star', starWrap);
    let rating = Number(localStorage.getItem('cr_rating') || 0);

    function paint(r){
      stars.forEach((s, i)=>{
        if(i < r) s.classList.add('filled');
        else s.classList.remove('filled');
      });
    }
    paint(rating);

    stars.forEach((s, i)=>{
      s.addEventListener('click', ()=>{
        rating = i+1;
        localStorage.setItem('cr_rating', String(rating));
        paint(rating);
      });
    });
  }

  // Upload modal
  const modal = qs('[data-modal]');
  const overlay = qs('[data-modal-overlay]');
  function openModal(opts={}){
    if(!overlay || !modal) return;
    overlay.classList.add('open');

    const descRow = qs('[data-desc-row]', modal);
    if(descRow){
      descRow.style.display = opts.withDescription ? 'grid' : 'none';
    }

    const title = qs('[data-modal-title]', modal);
    if(title) title.textContent = opts.title || 'Upload file';
  }
  function closeModal(){
    if(!overlay) return;
    overlay.classList.remove('open');
  }

  qsa('[data-open-upload]').forEach((btn)=>{
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      const withDescription = btn.getAttribute('data-with-description') === 'true';
      openModal({withDescription, title: 'Upload new file'});
    });
  });

  if(overlay){
    overlay.addEventListener('click', (e)=>{
      if(e.target === overlay) closeModal();
    });
  }
  qsa('[data-close-modal]').forEach((btn)=>btn.addEventListener('click', closeModal));

  const uploadForm = qs('[data-upload-form]');
  if(uploadForm){
    uploadForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      closeModal();
      alert('Uploaded (demo). Hook this to your backend later.');
    });
  }

  // Add-course page fake submit
  const addCourseForm = qs('[data-add-course-form]');
  if(addCourseForm){
    addCourseForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      window.location.href = 'course.html';
    });
  }

})();

async function logout(e) {
  if (e) e.preventDefault();

  const response = await fetch('http://localhost:3000/auth/logout', {
    method: 'GET',
    credentials: 'include'
  });
  console.log(response);
  localStorage.removeItem('cr_user');
  window.location.href = 'login.html';
}


