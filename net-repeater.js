/**
 * net-repeater.js
 * A simple repeater that makes names ready for the .NET MVC binder.
 *
 * @license No License
 * @version 0.1.2
 * @author  Ali Alhoshaiyan
 * @updated 2018-07-16
 */

// This will use the list name (List) and the item name (Item) to create the binding name as follows
// List[$].Item
// Given that $ is the index of the item
function indexItem($repeaterItem) {
    var index = $repeaterItem.attr('repeater-item-index');
    var listName = $repeaterItem.closest('[repeater-list]').attr('repeater-list');

    $repeaterItem.find('[item-name]').each(function() {
        var originalName = $(this).attr('item-name');
        $(this).attr('name', listName + '[' + index + '].' + originalName);
    });

    $repeaterItem.find('[item-for]').each(function() {
        var originalFor = $(this).attr('item-for');
        $(this).attr('for', listName + '[' + index + '].' + originalFor);
    });
}

function initItemInputs($repeaterItem) {
    // Save original name for each input
    $repeaterItem.find('input').each(function() {
        var name = $(this).attr('name');
        if(name !== null) {
            $(this).attr('item-name', name);
        }
    });

    // Special TextArea case
    $repeaterItem.find('textarea').each(function() {
        var name = $(this).attr('name');
        if(name !== null) {
            $(this).attr('item-name', name);
        }
    });

    // Save the original for attribute for each element that uses it
    $repeaterItem.find('[for]').each(function() {
        $(this).attr('item-for', $(this).attr('for'));
    });
}

function reorderItems($repeaterList) {
    var listItems = $repeaterList.find('[repeater-item]');
    var currentIndex = -1;
    for(var item of listItems) {
        $(item).attr('repeater-item-index', ++currentIndex);
        indexItem($(item));
    }
}

$(function() {

    $('.net-repeater').each(function() {
        var itemsCount = 0;
        var $repeaterList = $(this).find('[repeater-list]');
        var $addBtn = $(this).find('[repeater-add-btn]');
        var $repeaterTemplate = $(this).find('[repeater-template]');
        var repeaterTemplateString = $repeaterTemplate.html();

        // Delete the template from DOM
        $repeaterTemplate.remove();

        // Delete function
        function deleteItem() {
            $(this).closest('[repeater-item]').remove();
            itemsCount--;
            reorderItems($repeaterList);
        }

        // Configure the add btn
        $addBtn.on('click', function() {
            var $newItem = $(repeaterTemplateString);
            $newItem.attr('repeater-item', '');
            
            // Increase the item count
            itemsCount++;
            $newItem.attr('repeater-item-index', (itemsCount - 1));

            $newItem.find('[repeater-item-delete-btn]').on('click', deleteItem);

            // Must be added to the list first
            $repeaterList.append($newItem);
            initItemInputs($newItem);
            indexItem($newItem);
        });

        // Init manually added items for the first time
        var listItems = $repeaterList.find('[repeater-item]');
        for(var item of listItems) {
            // Increase the item count
            itemsCount++;
            $(item).attr('repeater-item-index', (itemsCount - 1));

            $(item).find('[repeater-item-delete-btn]').on('click', deleteItem);

            initItemInputs($(item));
            indexItem($(item));
        }

    });

});