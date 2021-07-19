// Copyright 2021, University of Colorado Boulder

/**
 * @author veillette
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import geometricOpticsColorProfile from '../common/geometricOpticsColorProfile.js';
import geometricOptics from '../geometricOptics.js';
import geometricOpticsStrings from '../geometricOpticsStrings.js';
import LensModel from './model/LensModel.js';
import LensScreenView from './view/LensScreenView.js';

class LensScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {

      name: geometricOpticsStrings.screen.lens,
      homeScreenIcon: new ScreenIcon( new Rectangle( 0, 0, 3, 3, { fill: 'pink' } ) ),
      backgroundColorProperty: geometricOpticsColorProfile.screenBackgroundColorProperty,
      tandem: tandem
    };

    super(
      () => new LensModel( tandem.createTandem( 'model' ) ),
      model => new LensScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

geometricOptics.register( 'LensScreen', LensScreen );
export default LensScreen;
