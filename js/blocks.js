/**
 * Gutenberg Blocks
 *
 * All blocks related JavaScript files should be imported here.
 * You can create a new block folder in this dir and include code
 * for that block here as well.
 *
 * All blocks should be included here since this is the file that
 * Webpack is compiling as the input file.
 */

import './blocks/bar';
import './blocks/line';
import './blocks/pie';
import './blocks/polar-area';
import './blocks/radar';

// WordPress filter hooks.
import './common/helpers/filters';
import './common/helpers/license';
