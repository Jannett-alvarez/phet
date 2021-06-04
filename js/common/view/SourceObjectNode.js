// Copyright 2021, University of Colorado Boulder

/**
 * View of the source/object
 * The sourceObject is represented by an object or a source of light
 * The sourceObject can be dragged
 * A secondary object can be dragged as a point or source of light
 *
 * @author Martin Veillette
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';

const OVERALL_SCALE_FACTOR = 0.5;
const OFFSET_VECTOR = new Vector2( 0.15, -0.18 );

class SourceObjectNode extends Node {

  /**
   * @param {Property.<Representation>} representationProperty
   * @param {SourceObject} sourceObject
   * @param {Property.<boolean>} visibleMovablePointProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * */
  constructor( representationProperty, sourceObject, visibleMovablePointProperty, modelViewTransform, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );
    super();

    // representation (image)  of the source/object. the source/object is upright and right facing
    const sourceObjectImage = new Image( representationProperty.value.rightFacingUpright, { scale: OVERALL_SCALE_FACTOR } );

    this.leftTopModelPositionProperty = new Vector2Property( sourceObject.getPosition().minus( OFFSET_VECTOR ) );

    // create drag listener for source
    const sourceObjectDragListener = new DragListener( {
      positionProperty: this.leftTopModelPositionProperty,
      transform: modelViewTransform
    } );

    sourceObjectImage.addInputListener( sourceObjectDragListener );

    this.leftTopModelPositionProperty.link( position => {
      const offsetPosition = position.plus( OFFSET_VECTOR );
      sourceObject.setPosition( offsetPosition );
      sourceObjectImage.leftTop = modelViewTransform.modelToViewPosition( position );
    } );

    const movableNode = new Node();

    const movableCirclePositionProperty = new Vector2Property( sourceObject.movablePositionProperty.value );

    const movablePointDragListener = new DragListener( {
      positionProperty: movableCirclePositionProperty,
      transform: modelViewTransform
    } );

    movableNode.addInputListener( movablePointDragListener );


    function setMovableNodePosition( position ) {
      const viewPosition = modelViewTransform.modelToViewPosition( position );
      if ( representationProperty.value.isObject ) {
        movableNode.center = viewPosition;
      }
      else {
        movableNode.leftTop = viewPosition.minus( modelViewTransform.modelToViewDelta( OFFSET_VECTOR ) );
      }
    }

    representationProperty.link( representation => {
      sourceObjectImage.image = representation.rightFacingUpright;

      movableNode.removeAllChildren();
      if ( representation.isObject ) {
        movableNode.addChild( new Circle( 3, { fill: 'black' } ) );
      }
      else {
        movableNode.addChild( new Image( representation.source, { scale: OVERALL_SCALE_FACTOR } ) );
      }
      setMovableNodePosition( sourceObject.movablePositionProperty.value );
    } );

    movableCirclePositionProperty.link( position => {
      sourceObject.setMovablePoint( representationProperty, position );
    } );

    sourceObject.movablePositionProperty.link( position => {
      setMovableNodePosition( position );
    } );

    visibleMovablePointProperty.linkAttribute( movableNode, 'visible' );

    this.addChild( sourceObjectImage );
    this.addChild( movableNode );
  }

  /**
   * @public
   */
  reset() {
    this.leftTopModelPositionProperty.reset();
  }
}

geometricOptics.register( 'SourceObjectNode', SourceObjectNode );
export default SourceObjectNode;
