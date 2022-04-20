input.onchange = (e) => {
  let file = input.files[0];
  let fileReader = new FileReader();
  fileReader.readAsText(file);
  fileReader.onload = function () {
    try {
      let data = JSON.parse(fileReader.result);
      console.log(data['type']);
    } catch (e) {
      console.log('Parse error: ' + toString(e.message));
    }
  };
  fileReader.onerror = function () {
    alert(fileReader.error);
  };
};
