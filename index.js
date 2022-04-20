input.onchange = (e) => {
  let file = input.files[0];
  let fileReader = new FileReader();
  fileReader.readAsText(file);
  fileReader.onload = function () {
    try {
      let data = JSON.parse(fileReader.result);
      if (data['type'] !== 'FeatureCollection') {
        throw 'Not a FeatureCollection';
      }
      for (let feature of data.features) {
        console.log(JSON.stringify(feature.geometry));
      }
    } catch (e) {
      console.error('Parse error: ' + e);
    }
  };
  fileReader.onerror = function () {
    alert(fileReader.error);
  };
};
