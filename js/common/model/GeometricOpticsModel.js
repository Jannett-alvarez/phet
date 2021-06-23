// Copyright 2021, University of Colorado Boulder

/**
 * Common Model for geometric optics
 *
 * @author Martin Veillette
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import FocalPoint from './FocalPoint.js';
import LightRayMode from './LightRayMode.js';
import LightRays from './LightRays.js';
import Representation from './Representation.js';
import Ruler from './Ruler.js';
import SourceObject from './SourceObject.js';
import TargetImage from './TargetImage.js';

class GeometricOpticsModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @public {Property.<Representation>}  representation of the source/object
    this.representationProperty = new Property( Representation.PENCIL );

    // @public {Property.<LightRayMode>}  modes for the different kind of light rays
    this.lightRayModeProperty = new EnumerationProperty( LightRayMode, LightRayMode.NO_RAYS );

    // @public {SourceObject} the object/ source
    this.sourceObject = new SourceObject( this.representationProperty, tandem );

    // @public rulers for the simulations
    this.rulers = {
      horizontal: new Ruler( new Vector2( 200, 100 ), 2.6 ),
      vertical: new Ruler( new Vector2( 100, 300 ), 1, { orientation: Ruler.Orientation.VERTICAL } )
    };


  }


  /**
   * Resets the model
   * @public
   */
  reset() {
    this.representationProperty.reset();
    this.lightRayModeProperty.reset();
    this.sourceObject.reset();
    this.rulers.vertical.reset();
    this.rulers.horizontal.reset();
  }

  /**
   * @protected
   * @param {Optic} optic
   * @param {Tandem} tandem
   */
  createCommonComponents( optic, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @public {FocalPoint} first principal focal point
    this.firstFocalPoint = new FocalPoint( optic.positionProperty, optic.focalLengthProperty, tandem );

    // @public {FocalPoint} second principal focal point
    this.secondFocalPoint = new FocalPoint( optic.positionProperty, optic.focalLengthProperty, tandem, { multiplicativeFactor: -1 } );

    // @public {TargetImage} target/ image
    this.targetImage = new TargetImage( this.sourceObject.positionProperty, optic, tandem );

    // @public {TargetImage} movable target/ image
    this.movableTargetImage = new TargetImage( this.sourceObject.movablePositionProperty, optic, tandem );

    // @public {LightRays} model of the light rays
    this.lightRays = new LightRays( this.lightRayModeProperty, this.sourceObject.positionProperty, optic, this.targetImage, tandem );

    // @public {LightRays} model of the "movable" light rays
    this.movableLightRays = new LightRays( this.lightRayModeProperty, this.sourceObject.movablePositionProperty, optic, this.movableTargetImage, tandem );
  }


}

geometricOptics.register( 'GeometricOpticsModel', GeometricOpticsModel );
export default GeometricOpticsModel;
