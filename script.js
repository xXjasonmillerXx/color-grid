let contrastSteps = 3;
let hueFamilies = 3;

let hue; 
let startHue = 200;
let endHue = 210;
let saturation100;
let saturation;
let contrast;
let lightness = 0;
let color;

let contrasts = [];
let hues = [];
let colorHSCs = [];


function updateColors() {
  saturation100 = parseFloat(document.getElementById('saturation').value);
  saturation = saturation100 / 100;

  let contrastValues = document.getElementsByName("contrast");
  for (step = 0; step < contrastValues.length; step++) {
    contrasts[step] = contrastValues[step].value;
  }
  let hueValues = document.getElementsByName("hue");
  for (step = 0; step < hueValues.length; step++) {
    hues[step] = hueValues[step].value;
  }
  for (step = 0; step < hues.length; step++) {
    colorHSCs[step] = Array(hues[step], saturation100 / 100, contrasts[step]);
  }
  console.log(contrasts, hues, colorHSCs);

}

function makeColor() {

  hue = parseFloat(document.getElementById('hue1').value);
  saturation100 = parseFloat(document.getElementById('saturation').value);
  saturation = saturation100 / 100;
  contrast = parseFloat(document.getElementById('contrast1').value);
  for (let lightness100 = 0; lightness100 < 101; lightness100++) {
    //runs on every value of lightness from 0 to 100
    let testLightness = lightness100 / 100;
    //convert lightness 0-100 to lightness 0-1 
    let testColorDarker = chroma({ h: hue, s: saturation, l: testLightness });
    let testColorLighter = chroma({ h: hue, s: saturation, l: testLightness+0.01 });
    //a pair of colors one step apart in lightness
    let testContrastDarker = Math.round(chroma.contrast(testColorDarker, 'white') * 100) / 100;
    let testContrastLighter = Math.round(chroma.contrast(testColorLighter, 'white') * 100) / 100;
    //get contrast ratio of test colors
    if (testContrastDarker - contrast <= 0 && testContrastLighter - contrast <= 0) {
      break;
      //stop looping if the test values are on either side of the target
    };
    let diff1 = testContrastDarker - contrast;
    let diff2 = contrast - testContrastLighter;
    //calculate how close each contrast ratio is to the target
    if (diff1 < diff2) {
      lightness = testLightness;
    } else {
      lightness = testLightness+0.01;
    }
    //compare them and use the lightness from the closest one
    //console.log(contrast, testContrastDarker, testContrastLighter, diff1, diff2, lightness);
  }
  color = chroma({ h: hue, s: saturation, l: lightness });
  console.log(chroma.contrast(color, 'white'));

  document.getElementById("swatch1").style.backgroundColor =
    color;
}



