document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
  
    const username = document.getElementById('username').value;
    const password =document.getElementById('password').value;
    
   
    if (username && password) {
        
        localStorage.setItem('username', username);

      
      
     
        setTimeout(() => {
            window.location.href = 'quiz.html'; 
        }, 1000); 
     
       
    }
    else{
        alert("please enter both username and password");
    }
});
