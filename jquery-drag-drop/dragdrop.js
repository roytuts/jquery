//used for tracking how many colors correctly dropped on to the empty slots
var colorCount = 0;
//number of colors in the color queue and empty slots
var TotalColors = 10;
//when the dom is ready call the function suffleColors
$(document).ready( suffleColors );

function suffleColors() {
	//initially hide the success message box
	$('#successMsg').hide();

	//initially hide the error message box
	$('#errorMsg').hide();

	//initially set value 0
	colorCount = 0;
	//initially empty string for colors and empty slots
	$('#colorQueue').html( '' );
	$('#colorSlots').html( '' );

	// Create the color queue with the color codes
	var colorCodes = [ '8B0000', 'FF1493', 'FF8C00', 'FFFF00', '9400D3', '006400', '00008B', 'A52A2A', 'F5F5F5', '808080' ];
	colorCodes.sort( function() { return Math.random() - .5 } );

	//iterate colorCodes array and put the colors in a div. Apply jquery ui draggable() with the div so that user can drag the color
	//data - we put the color codes as key/value('color'/colorCodes[i]) pairs in attribute called 'data'
	//attr - we give each div a unique id with color code
	//appendTo - where we will put the colors
	//draggable - jquery ui function for drag functionality
	//containment - constrains dragging to within the bounds of the specified element or region
	//stack - controls the z-index of the set of elements that match the selector, always brings the currently dragged item to the front.
	//cursor - mouse curson during the drag
	//revert - Whether the element should revert to its start position when dragging stops.
	//        Multiple types supported:
	//        Boolean: If set to true the element will always revert.
	//        String: If set to "invalid", revert will only occur if the draggable has not been dropped on a droppable. For "valid", it's the other way around.
	//        Function: A function to determine whether the element should revert to its start position. The function must return true to revert the element.
	for ( var i = 0; i < TotalColors; i++ ) {
		$('<div style="background-color:'+ '#' + colorCodes[i] +'"></div>').data( 'color', colorCodes[i] ).attr( 'id', colorCodes[i] ).appendTo( '#colorQueue' ).draggable( {
			containment: '#content',
			stack: '#colorQueue div',
			cursor: 'move',
			revert: true
		});
	}

	// Create the color slots with color codes and color names
	var tempColorCodes = [ '8B0000', 'FF1493', 'FF8C00', 'FFFF00', '9400D3', '006400', '00008B', 'A52A2A', 'F5F5F5', '808080' ];
	var colors = [ 'Dark red', 'Deep Pink', 'Dark Orange', 'Yellow', 'Dark Violet', 'Dark Green', 'Dark Blue', 'Brown', 'White Smoke', 'Gray' ];
	//data - we put the color codes in the attribute 'data' as a key/value pair
	//droppable - jquery ui function for drop functionality
	//accept - A draggable with the same scope value as a droppable will be accepted by the droppable.
	//drop - function handleColorDrop has been used to handle the droppable items
	for ( var i = 0; i < TotalColors; i++ ) {
		$('<div>' + colors[i] + '</div>').data('color', tempColorCodes[i]).appendTo('#colorSlots').droppable({
			accept: '#colorQueue div',
			hoverClass: 'hovered',
			drop: handleColorDrop
		});
	}
}

function handleColorDrop( event, ui ) {
	var slotNumber = $(this).data( 'color' );
	var colorNumber = ui.draggable.data( 'color' );

	// If the color was dropped to the correct slot,
	// position it directly on top of the dashed slot
	// and prevent it being dragged again
		if ( slotNumber === colorNumber ) {
		//if dropped on correct slot then hide the error message box
		$('#errorMsg').hide();
		//disable draggable
		ui.draggable.draggable( 'disable' );
		//disable droppable
		$(this).droppable( 'disable' );
		ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
		ui.draggable.draggable( 'option', 'revert', false );
		//track how many colors have been dropped on the slots
		colorCount++;
	} else {
		//show the error message if correct slot not selected for drop
		$('#errorMsg').show();
	}

	// If all the colors have been placed correctly then display a message
	if ( colorCount == TotalColors ) {
		$('#successMsg').show();
		$('#successMsg').animate( {
			left: '50%',
			top: '50%',
			margin: '-50px 0 0 -200px',
			width: '400px',
			height: '100px',
			opacity: 1
		});
	}

}
