var test = true;

var options = {
  layout: {
    improvedLayout:true,
    hierarchical: { enabled: false, nodeSpacing: 300}
  },
  interaction: { hover: true },
  manipulation: { enabled: false },
  physics: { stabilization: { fit: true }}
};

// for(N = 30; N < 40; N++){
//   $('body').append('<p>With '+ N + ' nodes:</p>');
//   testFF(100);
// }
N = 30;
testFF(7000);
