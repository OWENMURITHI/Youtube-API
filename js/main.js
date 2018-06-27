
$(function(){
    var searchField = $('#query');
    var icon        = $('#search-btn');
    var animateSpeed = 400;
    
    // Focus Event Handler
    $(searchField).on('focus', function(){
        $(this).animate({
            width:'70%'
          },animateSpeed);
        $(icon).animate({
            right:'265px'
        },animateSpeed);
    });
    $(searchField).on('blur', function(){
        if(searchField.val()== ''){
            $(searchField).animate({
                width:'50%'
            },animateSpeed);
            $(icon).animate({
                right:'445px'
            }, animateSpeed);
            
        };  
  
  });
   $('#search-form').submit(function(e){
       e.preventDefault();
   });
  });
  
  //Get results from API
 function search(){
    //Clear Results
    $('#results').html('');
    $('#buttons').html('');
    
    
    // Get from Input
       q = $('#query').val();
    
    //Run GET request on API
    $.get(
          "https://www.googleapis.com/youtube/v3/search", {
              part: 'snippet, id',
              q: q,
              type:'video',
              key:'AIzaSyDZrdUbBebFUqohj3ouS0tH0qTsjGP-AEw'},
          function(data){
              var nextPageToken = data.nextPageToken;
              var prevPageToken = data.prevPageToken;
              
            console.log(data);
        
          //get output   
         $.each(data.items, function(i, item){
               
             var output = getOutput(item);
              //display results
            $('#results').append(output);
            
         
        });
        var buttons = getButtons(prevPageToken,nextPageToken );
         
         //display Buttons
         $('#buttons').append(buttons);
    });

    }; 
 //NEXT PAGE HANDLER 
function nextPage(){
      
      var token = $('#next-button').data('token');
      var q = $('#next-button').data('query');
      $('#results').html('');
      $('#buttons').html('');
    
    
    // Get from Input
       q = $('#query').val();
    
    //Run GET request on API
     $.get(
          "https://www.googleapis.com/youtube/v3/search", {
              part: 'snippet, id',
              q: q,
              pageToken: token,
              type:'video',
              key:'AIzaSyDZrdUbBebFUqohj3ouS0tH0qTsjGP-AEw'},
          function(data){
              var nextPageToken = data.nextPageToken;
              var prevPageToken = data.prevPageToken;
              
            console.log(data);
        
          //get output   
         $.each(data.items, function(i, item){
               
             var output = getOutput(item);
              //display results
            $('#results').append(output);
            
         
        });
        var buttons = getButtons(prevPageToken,nextPageToken );
         
         //display Buttons
         $('#buttons').append(buttons);
    });

  }
  //prev Button
  function prevPage(){
      
      var token = $('#prev-button').data('token');
      var q = $('#prev-button').data('query');
      $('#results').html('');
      $('#buttons').html('');
    
    
    // Get from Input
       q = $('#query').val();
    
    //Run GET request on API
     $.get(
          "https://www.googleapis.com/youtube/v3/search", {
              part: 'snippet, id',
              q: q,
              pageToken: token,
              type:'video',
              key:'AIzaSyDZrdUbBebFUqohj3ouS0tH0qTsjGP-AEw'},
          function(data){
              var nextPageToken = data.nextPageToken;
              var prevPageToken = data.prevPageToken;
              
            console.log(data);
        
          //get output   
         $.each(data.items, function(i, item){
               
             var output = getOutput(item);
              //display results
            $('#results').append(output);
            
         
        });
        var buttons = getButtons(prevPageToken,nextPageToken );
         
         //display Buttons
         $('#buttons').append(buttons);
    });

  }
//Build Output
function getOutput(item){
     var videoId = item.id.videoId;
     var title = item.snippet.title;
     var description = item.snippet.description;
     var thumb = item.snippet.thumbnails.high.url;
     var channelTitle = item.snippet.channelTitle;
     var videoDate = item.snippet.publishedAt;
     
     //build output string
     
    var output = '<li>' +
             '<div class ="list-left">' +
             '<img src="'+thumb+'">' +
             '</div>' +
             '<div class="list-right">' +
             '<div class="youtube-player">'+
             '<iframe width="700" height="700" src="https://www.youtube.com/embed/'+videoId+'" frameborder="0" allowfullscreen></iframe>' +
             '<a href="#" class="youtube-link-start">'+title+'</h3></a>' +
             '<a href="#" class="youtube-link-stop"><button id="CloseButton">Close Video</button></a>' +
             '</div>' +
             '<small>By <span class="cTitle">'+channelTitle+'</span> on '+videoDate+'</small>'+
             '<p>'+description+'</p>' +
             '</div>' +
             '</li>'+
             '<div class="clearfix"></div>' +
             
             '';
     $('.youtube-player').each(function(){
         
            $(this).on('click', '.youtube-link-start', function(){
                $(this).parent().addClass('active');
            
                var loc = $(this).siblings('iframe').attr('src');
                var startloc = loc + "?autoplay=1";
                $(this).siblings('iframe').attr('src', startloc);
            });

            $(this).on('click', '.youtube-link-stop', function(){
                $(this).parent().removeClass('active');

                var loc = $(this).siblings('iframe').attr('src');
                var stoploc = loc.replace("?autoplay=1", "");
                $(this).siblings('iframe').attr('src', stoploc);
            });
        });
             return output;
 }
//Build Buttons
function getButtons(prevPageToken, nextPageToken){
    if(!prevPageToken){
        var btnoutput = '<div class="button-container">'+
                '<button id="next-button" class="paging-button" data-token ="'+nextPageToken+'"data-query="'+q+'"'+
                'onclick = "nextPage();">NextPage</button> </div>';
    }
    else{
        var btnoutput = '<div class="button-container">'+
                '<button id="prev-button" class="paging-button" data-token ="'+prevPageToken+'"data-query="'+q+'"'+
                'onclick = "prevPage();">PrevPage</button>' +
                '<button id="next-button" class="paging-button" data-token ="'+nextPageToken+'"data-query="'+q+'"'+
                'onclick = "nextPage();">NextPage</button> </div>';
    }
    return btnoutput;
 };
