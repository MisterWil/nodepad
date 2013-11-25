$('.destroy').live('click', function(e) {
  e.preventDefault();
  var targetUrl = $(this).attr("href");
  if (confirm('Are you sure you want to delete that item?')) {
    window.location.href = targetUrl;
  }
});

