// Copyright 2017 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import TweenMax from 'gsap';

import GLOBALS from './config.js';
import Button from './ui/components/Button.js';
import IntroSection from './ui/modules/IntroSection.js';
import InputSection from './ui/modules/InputSection.js';
import LearningSection from './ui/modules/LearningSection.js';
import OutputSection from './ui/modules/OutputSection.js';
import RecordOpener from './ui/components/RecordOpener.js';
import BrowserUtils from './ui/components/BrowserUtils';

function init() {

	// Shim for forEach for IE/Edge
    if (typeof NodeList.prototype.forEach !== 'function') {
        NodeList.prototype.forEach = Array.prototype.forEach;
	}
  GLOBALS.browserUtils = new BrowserUtils();

  GLOBALS.learningSection = new LearningSection(document.querySelector('#learning-section'));
	GLOBALS.inputSection = new InputSection(document.querySelector('#input-section'));
	GLOBALS.outputSection = new OutputSection(document.querySelector('#output-section'));

	GLOBALS.inputSection.ready();
	GLOBALS.learningSection.ready();
	if (localStorage.getItem('isBackFacingCam') && localStorage.getItem('isBackFacingCam') === 'true') {
		GLOBALS.isBackFacingCam = true;
  }
  
  // stuff stolen from wizzard
  GLOBALS.camInput.start();
  GLOBALS.inputSection.enable();
  GLOBALS.inputSection.hideGif(0);
  GLOBALS.inputSection.hideGif(1);
  GLOBALS.inputSection.hideGif(2);
  GLOBALS.inputSection.hideGif(3);
  GLOBALS.inputSection.undim();
  GLOBALS.learningSection.dehighlight();
  GLOBALS.learningSection.dehighlightClass(0);
  GLOBALS.learningSection.dehighlightClass(1);
  GLOBALS.learningSection.dehighlightClass(2);
  GLOBALS.learningSection.enable();
  GLOBALS.learningSection.enableClass(0);
  GLOBALS.learningSection.enableClass(1);
  GLOBALS.learningSection.enableClass(2);
  GLOBALS.learningSection.undim();
  GLOBALS.outputSection.dehighlight();
  GLOBALS.outputSection.enable();
  GLOBALS.outputSection.undim();
}

window.addEventListener('load', init);

export default GLOBALS;