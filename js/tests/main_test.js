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

$('body').append('<p>With 20 nodes:</p>');
N = 20;
testFF(100);
$('body').append('<p>With 22 nodes:</p>');
N = 22;
testFF(100);
$('body').append('<p>With 24 nodes:</p>');
N = 24;
testFF(100);
$('body').append('<p>With 26 nodes:</p>');
N = 26;
testFF(100);
$('body').append('<p>With 28 nodes:</p>');
N = 28;
testFF(100);
$('body').append('<p>With 30 nodes:</p>');
N = 30;
testFF(100);

// N = 22;
// testFF(100);
//
// N = 22;
// testFF(100);
//
// N = 22;
// testFF(100);
