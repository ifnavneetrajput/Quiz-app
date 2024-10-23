document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
  
    const username = document.getElementById('username').value;
    
   
    if (username && password) {
        
        localStorage.setItem('username', username);

      
      
     
        setTimeout(() => {
            window.location.href = 'quiz.html'; 
        }, 2000); 
     
       
    }
    else{
        alert("please enter both username and password");
    }
});
