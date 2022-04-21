input.onchange = (e) => {
  let file = input.files[0];
  let [date, description] = [];
  try {
    [date, description] = checkfilename(file.name);
  } catch (e) {
    console.error('Non compliant filename: ' + e);
    throw e;
  }
  console.log(date);
  console.log(description);
  // Check if source already uploaded (and fail)
  try {
    const xhttp = new XMLHttpRequest();
    const source = file.name.split('.')[0];
    let stat = {};
    xhttp.onload = function () {
      stat = JSON.parse(JSON.parse(this.responseText));
    };
    xhttp.open(
      'GET',
      `https://data.mongodb-api.com/app/underlandscape-app-fwkpt/endpoint/stat?source=${source}`,
      false
    );
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.send();
    if (stat.n != 0) throw `A source named ${source} has been already uploaded`;
  } catch (e) {
    console.error(e);
    throw e;
  }
  // Test finished
  let fileReader = new FileReader();
  fileReader.readAsText(file);
  fileReader.onload = function () {
    try {
      let data = JSON.parse(fileReader.result);
      if (data['type'] !== 'FeatureCollection') {
        throw 'Not a FeatureCollection';
      }
      let n = 0;
      for (let feature of data.features) {
        feature.source = file.name.split('.')[0];
        feature.serial = n + 1;
        //        console.log(JSON.stringify(feature));
        n = n + 1;
      }
      const xhttp = new XMLHttpRequest();
      xhttp.onload = function () {
        console.log(this.responseText);
      };
      xhttp.open(
        'POST',
        'https://data.mongodb-api.com/app/underlandscape-app-fwkpt/endpoint/upload_geojson?secret=arazHX6V'
      );
      xhttp.setRequestHeader('Content-type', 'application/json');
      xhttp.send(JSON.stringify(data.features));
    } catch (e) {
      console.error('Parse error: ' + e);
    }
  };
  fileReader.onerror = function () {
    alert(fileReader.error);
  };
};

function checkfilename(fn) {
  let parts = fn.split('.');
  if (parts.length !== 2) throw 'no dots in the description';
  if (parts[1] !== 'geojson') throw 'extension MUST be "geojson"';
  if (parts[0].length < 5 || parts[0].length > 20)
    throw 'description length in [5..20]';
  if (!parts[0].match(/^[0-9]{8}-[0-9a-zA-Z]+$/))
    throw 'Description must be in format "yyyymmdd-xxxxxxxxxxx"';
  return parts[0].split('-');
}
