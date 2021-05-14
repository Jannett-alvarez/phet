// Copyright 2021, University of Colorado Boulder

/**
 * @author Martin Veillette
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import CommonModel from '../../common/model/CommonModel.js';
import FocalPoint from '../../common/model/FocalPoint.js';
import Lens from './Lens.js';
import LightRays from '../../common/model/LightRays.js';
import TargetImage from '../../common/model/TargetImage.js';
import geometricOptics from '../../geometricOptics.js';

class LensModel extends CommonModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( tandem );


    this.optic = new Lens( tandem );
    this.firstFocalPoint = new FocalPoint( this.optic.positionProperty, this.optic.focalLengthProperty, tandem );
    this.secondFocalPoint = new FocalPoint( this.optic.positionProperty, this.optic.focalLengthProperty, tandem, { multiplicativeFactor: -1 } );

    this.targetImage = new TargetImage( this.sourceObject, this.optic, tandem );
    this.lightRays = new LightRays( this.sourceObject.positionProperty, this.optic, this.targetImage, tandem );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.optic.reset();
    this.sourceObject.reset();
    this.targetImage.reset();
    this.lightRays.reset();
  }

}


geometricOptics.register( 'LensModel', LensModel );
export default LensModel;
