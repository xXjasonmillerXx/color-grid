function createContrastSetting(step) {
  let contrastSetting = document.createElement("div");
  let contrastNameLabel = document.createElement("label");
  let contrastNameLabelText = document.createTextNode("Step name: ");
  let contrastNameInput = document.createElement("input");
  let contrastSettingLabel = document.createElement("label");
  let contrastSettingLabelText = document.createTextNode("Target contrast: ");
  let contrastSettingInput = document.createElement("input");
  let contrastSettingDelete = document.createElement("button");
  let contrastSettingDeleteText = document.createTextNode("Delete");
  //create contrastSetting contents

  contrastSetting.id = "contrastSetting" + step;
  contrastNameInput.id = "nameS" + step;
  contrastNameInput.className = "nameInput stepName";
  contrastNameInput.addEventListener("change", updateUIFromInputs);
  contrastNameInput.addEventListener("click", contrastNameInput.select);
  contrastSettingInput.id = "step" + step;
  contrastSetting.className = "contrastSetting";
  contrastSettingInput.type = "number";
  contrastSettingInput.name = "contrast";
  //contrastSettingInput.value = "2";
  contrastSettingInput.addEventListener("change", updateUIFromInputs);
  contrastSettingInput.addEventListener("click", contrastSettingInput.select);
  contrastSettingInput.min = "1";
  contrastSettingInput.max = "21";
  contrastSettingInput.step = "0.1";
  contrastSettingDelete.addEventListener("click", delContrastStep);
  //add attributes to contents

  document.getElementById("contrastSettings").appendChild(contrastSetting);
  contrastSetting.appendChild(contrastNameLabel);
  contrastNameLabel.appendChild(contrastNameLabelText);
  contrastSetting.appendChild(contrastNameInput);
  contrastSetting.appendChild(contrastSettingLabel);
  contrastSettingLabel.appendChild(contrastSettingLabelText);
  contrastSetting.appendChild(contrastSettingInput);
  contrastSetting.appendChild(contrastSettingDelete);
  contrastSettingDelete.appendChild(contrastSettingDeleteText);
  //put contents in DOM
}

function createHueSetting(fam) {
  let hueSetting = document.createElement("div");
  let hueNameLabel = document.createElement("label");
  let hueNameLabelText = document.createTextNode("Hue name: ");
  let hueNameInput = document.createElement("input");
  let hueSettingLabel = document.createElement("label");
  let hueSettingLabelText = document.createTextNode("Hue: ");
  let hueSettingInput = document.createElement("input");
  let hueSatLabel = document.createElement("label");
  let hueSatLabelText = document.createTextNode("Sat: ");
  let hueSatInput = document.createElement("input");
  let hueSettingDelete = document.createElement("button");
  let hueSettingDeleteText = document.createTextNode("Delete");
  //create hueSetting contents

  hueSetting.id = "hueSetting" + fam;
  hueNameInput.id = "nameF" + fam;
  hueNameInput.className = "nameInput hueName";
  hueNameInput.addEventListener("change", updateUIFromInputs);
  hueNameInput.addEventListener("click", hueNameInput.select);
  hueSettingInput.id = "fam" + fam;
  hueSetting.className = "hueSetting";
  hueSettingInput.type = "number";
  hueSettingInput.name = "hueStart";
  //hueSettingInput.value = "0";
  hueSettingInput.addEventListener("change", updateUIFromInputs);
  hueSettingInput.addEventListener("click", hueSettingInput.select);
  hueSettingInput.min = "-360";
  hueSettingInput.max = "360";
  hueSatInput.id = "sat" + fam;
  hueSatInput.className = "hueSat";
  hueSatInput.type = "number";
  hueSatInput.name = "sat";
  hueSatInput.addEventListener("change", updateUIFromInputs);
  hueSatInput.addEventListener("click", hueSatInput.select);
  hueSatInput.min = "0";
  hueSatInput.max = "100";
  hueSettingDelete.addEventListener("click", delHueStep);
  //add attributes to contents

  document.getElementById("hueSettings").appendChild(hueSetting);
  hueSetting.appendChild(hueNameLabel);
  hueNameLabel.appendChild(hueNameLabelText);
  hueSetting.appendChild(hueNameInput);
  hueSetting.appendChild(hueSettingLabel);
  hueSettingLabel.appendChild(hueSettingLabelText);
  hueSetting.appendChild(hueSettingInput);
  hueSetting.appendChild(hueSettingDelete);
  hueSetting.appendChild(hueSatLabel);
  hueSetting.appendChild(hueSatInput);
  hueSatLabel.appendChild(hueSatLabelText);
  hueSettingDelete.appendChild(hueSettingDeleteText);
  //put contents in DOM
}

function createEndHueSetting(fam) {
  let hueEndSetting = document.createElement("div");
  let hueEndSettingLabel = document.createElement("label");
  let hueEndSettingLabelText = document.createTextNode("End Hue: ");
  let hueEndSettingInput = document.createElement("input");
  //let hueEndSettingDelete = document.createElement("button");
  //let hueEndSettingDeleteText = document.createTextNode("Delete");
  let hueEndSettingFlip = document.createElement("button");
  let hueEndSettingFlipText = document.createTextNode("Flip");
  let hueEndSettingToggle = document.createElement("button");
  let hueEndSettingToggleText = document.createTextNode("Remove End Hue");
  //create hueEndSetting contents

  hueEndSetting.id = "hueEndSetting" + fam;
  hueEndSettingInput.id = "famEnd" + fam;
  hueEndSetting.className = "hueSetting";
  hueEndSettingInput.type = "number";
  hueEndSettingInput.name = "hueEnd";
  hueEndSettingInput.addEventListener("change", updateUIFromInputs);
  hueEndSettingInput.addEventListener("click", hueEndSettingInput.select);
  hueEndSettingInput.min = "-360";
  hueEndSettingInput.max = "360";
  hueEndSettingFlip.id = "flip" + fam;
  hueEndSettingFlip.addEventListener("click", flipHues);
  hueEndSettingToggle.id = "hueEndEnable" + fam;
  hueEndSettingToggle.addEventListener("click", toggleHueEnd);
  //add attributes to contents

  document.getElementById("hueEndSettings").appendChild(hueEndSetting);
  hueEndSetting.appendChild(hueEndSettingLabel);
  hueEndSetting.appendChild(hueEndSettingInput);
  hueEndSetting.appendChild(hueEndSettingFlip);
  hueEndSettingLabel.appendChild(hueEndSettingLabelText);
  hueEndSettingFlip.appendChild(hueEndSettingFlipText);
  //hueEndSetting.appendChild(hueEndSettingDelete);
  //hueEndSettingDelete.appendChild(hueEndSettingDeleteText);
  hueEndSetting.appendChild(hueEndSettingToggle);
  hueEndSettingToggle.appendChild(hueEndSettingToggleText);
  //put contents in DOM
  //console.log(hueEndEnabled[fam], fam);

  if (json.hueEndEnabled[fam] == false) {
    hueEndSettingToggleText.nodeValue = "Add End Hue";
    hueEndSettingLabel.style.display = "none";
    hueEndSettingInput.style.display = "none";
    hueEndSettingFlip.style.display = "none";
    //console.log(hueEnds[fam], hueStarts[fam]);
    //if hue end is true, append elements to DOM, else don't
    //console.log(hueEndEnabled[fam]);
  }
}

function createSwatch(fam, step) {
  let hueValue;
  if (json.hueEndEnabled[fam] == true) {
    if (flips[fam] == true) {
      hueValue = calcHueFlipped(fam, step); //get hue from wraparound technique
    } else {
      hueValue = calcHue(fam, step); //get hue from normal technique
    }
  } else {
    let hueStartID = "fam" + fam; //get ids of hue inputs
    hueValue = document.getElementById(hueStartID).value; //use hue start value as only hue value
  }

  let contrastID = "step" + step; //get id of corresponding contrast input
  let contrastValue = document.getElementById(contrastID).value; //get value of contrast input
  let satValue = json.saturation[fam];
  let color = getContrast(hueValue, satValue, contrastValue); //get color
  let actualContrast = Math.round(chroma.contrast(color, "white") * 100)/100; //get actual contrast of color
  let hex = chroma(color).hex();
  hexes.push(hex);
  let hsl = chroma(color).css('hsl');
  hsls.push(hsl);
  //console.log(hueID, hueStartValue, contrastID, contrastValue, saturation100);

  let stepName = document.getElementById("nameS" + step).value;
  let famName = document.getElementById("nameF" + fam).value;

  let swatch = document.createElement("div");
  let swatchName = document.createElement("p");
  let swatchNameText = document.createTextNode(famName + stepName);
  let swatchContrast = document.createElement("p");
  let swatchContrastText = document.createTextNode("Contrast: " + actualContrast);
  let swatchHex = document.createElement("p");
  let swatchHexText = document.createTextNode(hex);
  let swatchHsl = document.createElement("p");
  let swatchHslText = document.createTextNode(hsl);
  let ack = document.createElement("div");
  let ackName = document.createElement("p");
  let ackNameText = document.createTextNode("Copied!");
  //create swatch contents

  swatch.id = "swatchF" + fam + "S" + step;
  swatch.className = "swatch";
  swatch.addEventListener("click", copyHsl);
  swatchName.className = "swatchText";
  swatch.style.backgroundColor = color;
  swatchContrast.className = "swatchText";
  swatchHex.id = "hexF" + fam + "S" + step;
  swatchHex.className = "swatchText swatchHex";
  swatchHsl.id = "hslF" + fam + "S" + step;
  swatchHsl.className = "swatchText swatchHsl";
  ack.className = "ack";
  if (actualContrast < 4.5) {
    swatch.style.color = "black";
    ack.style.backgroundColor = "black";
    ack.style.color = "white";
  } else { 
    swatch.style.color = "white";
    ack.style.backgroundColor = "white";
    ack.style.color = "black";
    }
  //add attributes to contents

  document.getElementById("grid").appendChild(swatch);
  swatch.appendChild(swatchName);
  swatchName.appendChild(swatchNameText);
  swatch.appendChild(swatchContrast);
  swatchContrast.appendChild(swatchContrastText);
  swatch.appendChild(swatchHex);
  swatchHex.appendChild(swatchHexText);
  swatch.appendChild(swatchHsl);
  swatchHsl.appendChild(swatchHslText);
  swatch.appendChild(ack);
  ack.appendChild(ackName);
  ackName.appendChild(ackNameText);
  //put contents in DOM
}