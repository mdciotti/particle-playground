// GRAPHICAL USER INTERFACE CONTROLLER

import Pane from './src/pane.js';
import { Bin, GridBin, ListBin } from './src/bin/index.js';
import {
	ActionController,
	CanvasController,
	ColorController,
	DropdownController,
	GridController,
	HTMLController,
	InfoController,
	NumberController,
	TextController,
	ToggleController
} from './src/controller/index.js';

export default {
	Pane,
	Bin,
	GridBin,
	ListBin,
	ActionController,
	CanvasController,
	ColorController,
	DropdownController,
	GridController,
	HTMLController,
	InfoController,
	NumberController,
	TextController,
	ToggleController
};

// Webpack: load stylesheet
require('./styles/main.less');

