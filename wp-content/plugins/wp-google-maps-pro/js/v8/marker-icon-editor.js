/**
 * @namespace WPGMZA
 * @module MarkerIconEditor
 * @requires WPGMZA
 */
 jQuery(function($) {
    /**
     * Marker Icon Editor Class
     * 
     * @param Element element The container element
     */
	WPGMZA.MarkerIconEditor = function(element) {
        this.source = false;
        this.layerModeState = false;

        this.container = $(element);

        this.findElements();
        this.bindEvents();
    }

    /**
     * Find the local elements within the container which control editor behaviour
     * 
     * @return void
     */
    WPGMZA.MarkerIconEditor.prototype.findElements = function(){
        this.preview = this.container.find('.wpgmza-marker-icon-editor-preview canvas');
        this.icons = this.container.find('.wpgmza-marker-icon-editor-list .base-icon');

        this.tabs = this.container.find('.wpgmza-marker-icon-editor-tabs .inner-tab');

        this.layerMode = this.container.find('.wpgmza-icon-layer-mode-wrapper select');
        this.layerControls = this.container.find('.wpgmza-icon-layer-control[data-mode]');
        this.layerInputs = this.container.find('.wpgmza-icon-layer-control input');

        this.effectMode = this.container.find('.wpgmza-icon-effect-mode-wrapper select');
        this.effectControls = this.container.find('.wpgmza-marker-icon-editor-controls input[type="range"]');

        this.actions = this.container.find('.wpgmza-marker-icon-editor-actions .wpgmza-button');

        this.historyToggle = this.container.find('.wpgmza-marker-icon-editor-history-toggle');

        this.setRestoreState();
        this.setBinding(false);

        /* Init Font Awesome Picker */
        this.container.find(".icon-picker").each((index, element) => {
            element.wpgmzaFaPicker = new WPGMZA.FontAwesomeIconPickerField(element);
        });
    }

    /**
     * Bind events from local elements (and some globals) to trigger class specific methods 
     * 
     * @return void
     */
    WPGMZA.MarkerIconEditor.prototype.bindEvents = function(){
        /* Local methods */
        this.icons.on('click', (event) => {
            event.preventDefault();
            this.onClickIcon(event.currentTarget);
        });

        this.actions.on('click', (event) => {
            event.preventDefault();
            this.onClickAction(event.currentTarget);
        });

        this.tabs.on('click', (event) => {
            event.preventDefault();
            this.onClickTab(event.currentTarget);
        });

        this.layerMode.on('change', (event) => {
            event.preventDefault();
            this.onChangeLayerMode(event.currentTarget);
            this.updatePreview();
        });

        this.layerInputs.on('change input', (event) => {
            event.preventDefault();
            this.updatePreview();
        });

        this.effectMode.on('change', (event) => {
            event.preventDefault();
            this.onChangeEffectMode(event.currentTarget);
        });

        this.effectControls.on('change input', (event) => {
            event.preventDefault();
            this.updatePreview();
        });

        this.historyToggle.on('click', (event) => {
            event.preventDefault();
            this.container.toggleClass('view-history');
        });

        /* Global methods */
        $(document.body).on('click', '.wpgmza-marker-library', (event) => {
            event.preventDefault();
            this.onBindInput(event.currentTarget);
        });

        $(document.body).find('.wpgmza-editor .sidebar .grouping').on('grouping-opened', (event) => {
            if(this.isVisible()){
                this.hide();
            }
        });

        $(window).on('resize', (event) => {
            if(this.isVisible()){
                this.autoPlace();
            }
        });

    }

    /**
     * On Click Icon 
     * 
     * @param object context The context that triggered the event, usually current target from a click event
     * 
     * @return void 
    */
    WPGMZA.MarkerIconEditor.prototype.onClickIcon = function(context){
        if(context instanceof HTMLElement){
            const icon = $(context);
            const source = icon.data('src');
            if(source){
                this.container.find('.wpgmza-marker-icon-editor-list .base-icon.selected').removeClass('selected');
                icon.addClass('selected');
                this.setIcon(source);
            }
        }
    }

    /**
     * On Click Action (button)
     * 
     * @param object context The context that triggered the event, usually current target from a click event
     * 
     * @return void 
     */
    WPGMZA.MarkerIconEditor.prototype.onClickAction = function(context){
        if(context instanceof HTMLElement){
            const button = $(context);
            const action = button.data('action');
            if(action){
                switch(action){
                    case 'use':
                        this.saveIcon();
                        break;
                    default:
                        this.hide();
                        break;
                }
            }
        }
    }

    /**
     * On Click Tab (button)
     * 
     * @param object context The context that triggered the event, usually the current target from the click event 
     * 
     * @return void 
     */
    WPGMZA.MarkerIconEditor.prototype.onClickTab = function(context){
        if(context instanceof HTMLElement){
            const element = $(context);
            const tab = element.data('tab');
            if(tab){
                this.tabs.removeClass('active');
                element.addClass('active');
                
                this.container.find('.wpgmza-marker-icon-editor-tab').removeClass('active');
                this.container.find('.wpgmza-marker-icon-editor-tab[data-tab="' + tab + '"]').addClass('active');
            }
        }
    }

    /**
     * On Bind input
     * 
     * Binds the editor to a specific marker icon picker, this is done by hooking into clicks on the 'library' button present in all pickers 
     * 
     * Made more robust here so that we can trigger it in other use cases as well if needed
     * 
     * @param object context The context that triggered the event, usually current target from a click event
     * 
     * @return void
     */
    WPGMZA.MarkerIconEditor.prototype.onBindInput = function(context){
        if(context instanceof HTMLElement){
            this.setBinding(context);
            this.show();
        }
    }

    /**
     * On change layer mode
     * 
     * @param object context The context that triggered this event, usually current target from change event 
     * 
     * @return void
     */
    WPGMZA.MarkerIconEditor.prototype.onChangeLayerMode = function(context){
        if(context instanceof HTMLElement){
            const mode = $(context).val();
            if(mode !== this.layerModeState){
                this.layerModeState = mode;

                this.layerControls.removeClass('active');
                this.container.find('.wpgmza-icon-layer-control[data-mode="' + this.layerModeState + '"]').addClass('active');
            }
        }
    }

    /**
     * On Change Effect mode
     * 
     * @param object context The context that triggered the event, usually the current target from the change event 
     */
    WPGMZA.MarkerIconEditor.prototype.onChangeEffectMode = function(context){
        if(context instanceof HTMLElement){
            const mode = $(context).val();
            this.effectControls.removeClass('active');
            this.container.find('.wpgmza-marker-icon-editor-controls input[type="range"][data-control="' + mode + '"]').addClass('active');
        }
    }

    /**
     * Set the binding element where marker icons should be applied
     * 
     * @param Element element The element root for the binding, set to false to undbind
     * 
     * @return void
     */
    WPGMZA.MarkerIconEditor.prototype.setBinding = function(element){
        if(element !== this.binding){
            /* Indicates a change in binding - Mark editor dirty, this will reinit some modules later */
            this.dirty = true;
        }

        this.binding = element;
    }

    /**
     * Caches some of the controls default values to be restored when the editor is marked as dirty
     * 
     * @return void
     */
    WPGMZA.MarkerIconEditor.prototype.setRestoreState = function(){
        this.layerInputs.each((index, element) => {
            $(element).attr('data-restore', $(element).val());
        });

        this.effectControls.each((index, element) => {
            $(element).attr('data-restore', $(element).val());
        });
    }

    /**
     * Set the current editor base icon
     * 
     * This will trigger canvas redraws and initialization
     * 
     * @param string source The URL to the marker icon base 
     * 
     * @return void
     */
    WPGMZA.MarkerIconEditor.prototype.setIcon = function(source){
        source = source ? source : this.getDefaultIcon();
        if(source !== this.source){
            this.source = source;
            this.prepareCanvas();
            this.updatePreview();
        }
    }

    /**
     * Get the default icon, this is done by walking the system icons for the first child
     * 
     * @return string
     */
    WPGMZA.MarkerIconEditor.prototype.getDefaultIcon = function(){
        let icon = this.container.find('.wpgmza-marker-icon-editor-list *[data-type="system"]');
        if(icon.length){
            icon = $(icon.get(0));
            const source = icon.data('src');
            if(source){
                return source;
            } 
        }

        return false;
    }
    
    /**
     * Get a reference to the DOM Element based on the current data source
     * 
     * @returns Element
     */
    WPGMZA.MarkerIconEditor.prototype.getSourceElement = function(){
        if(this.source){
            const image = this.container.find('.wpgmza-marker-icon-editor-list *[data-src="' + this.source + '"] img');
            if(image.length){
                return image.get(0);
            }
        }
        return false;
    }

    /**
     * Get the natural dimensions of the source
     * 
     * This is done by finding the source element in the dom and leveraging the natural width/height properties to get an accurate resolution
     * 
     * @returns object
     */
    WPGMZA.MarkerIconEditor.prototype.getSourceDimensions = function(){
        const dimensions = {
            width : 27,
            height: 43
        };

        if(this.source){
            const imageElement = this.getSourceElement();
            if(imageElement){
                dimensions.width = imageElement.naturalWidth;
                dimensions.height = imageElement.naturalHeight;
            }
        }

        return dimensions;
    }

    /**
     * Compiles all active editor controls into a single CSS filter which can be applied to the editor 
     * 
     * @returns string
     */
    WPGMZA.MarkerIconEditor.prototype.getFilters = function(){
        let filters = [];
        
        this.effectControls.each((index, elem) => {
            const input = $(elem);
            const filter = input.data('control');
            const suffix = input.data('suffix');
            if(filter){
                let compiled = filter.trim() + "(" + input.val().trim() + (suffix ? suffix.trim() : "") + ")";
                filters.push(compiled); 
            }
        });

        return filters.length ? filters.join(" ") : "";
    }

    /**
     * Prepares the controls in the editor
     * 
     * This sets up defaults, restores values, and select the first icon
     * 
     * Usually, this is called after the editor is marked as dirty
     * 
     * @return void
     */
    WPGMZA.MarkerIconEditor.prototype.prepareControls = function(){
        this.container.removeClass('view-history');

        this.layerInputs.each((index, element) => {
            const restore = $(element).data('restore');
            
            let fallback = "";
            const type = $(element).attr('type');
            switch(type){
                case 'number':
                    fallback = 0;
                    break;
                case 'checkbox':
                    $(element).prop('checked', false).trigger('change');
                    break;
            }

            if(type === 'checkbox'){
                return;
            }

            $(element).val(restore ? restore : fallback);
            $(element).trigger('change');
        });

        this.effectControls.each((index, element) => {
            const restore = $(element).data('restore');
            $(element).val(restore ? restore : 0);
            $(element).trigger('change');
        });

        this.icons.first().trigger('click');

        this.tabs.first().trigger('click');

        this.layerMode.val('text');
        this.layerMode.trigger('change');
        
        this.effectMode.val('hue-rotate');
        this.effectMode.trigger('change');
    }

    /**
     * Prepare the canvas based on the current base icon
     * 
     * This loads the base canvas params, like widths etc, but does not actually handle drawing the layers in the canvas directly
     * 
     * @return void
     */
    WPGMZA.MarkerIconEditor.prototype.prepareCanvas = function(){
        const canvas = this.preview.get(0);
        const dimensions = this.getSourceDimensions();
        
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
    }

    /**
     * Update the preview 
     * 
     * This will access the canvas, issue draw commands, and render accordingly using all layers
     * 
     * @return void
     */
    WPGMZA.MarkerIconEditor.prototype.updatePreview = function(){
        const canvas = this.preview.get(0);
        const context = canvas.getContext("2d");
        
        context.clearRect(0, 0, canvas.width, canvas.height);

        if(this.source){
            if(!this.imageData || this.imageData.src !== this.source){
                this.imageData = new Image();

                /* Link onload to the refresh method */
                this.imageData.onload = () => {
                    this.renderImage(canvas, context);
                    this.renderOverlay(canvas, context);
                };

                this.imageData.src = this.source;
            } else {
                /* Refresh without reloading the image */
                this.renderImage(canvas, context);
                this.renderOverlay(canvas, context);
            }
        }
    }

    /**
     * Renders the image layer
     * 
     * This is triggered by the image state, from the updatePreview method, instead of using a nested callback
     * 
     * @return void
     */
    WPGMZA.MarkerIconEditor.prototype.renderImage = function(canvas, context){
        if(this.imageData){
            const filters = this.getFilters();
            if(filters){
                context.filter = filters;
            }
            context.drawImage(this.imageData, 0, 0);
        }
    }

    /**
     * Renders the overlay layer 
     * 
     * This is triggered after renderImage in most cases, to ensure the layer is drawn above the image
     *  
     * @param Element canvas The canvase element
     * @param Context context The canvas context
     * 
     * @return void
     */
    WPGMZA.MarkerIconEditor.prototype.renderOverlay = function(canvas, context){
        const layerOptions = {};
        
        this.layerInputs.each((index, input) => {
            const control = $(input).data('control');
            if(control){
                if($(input).attr('type') === "checkbox"){
                    layerOptions[control] = $(input).prop('checked');
                } else {
                    layerOptions[control] = $(input).val();
                }
            }
        });

        layerOptions.size = (layerOptions.size ? parseInt(layerOptions.size) : 20);

        const position = {
            x : (canvas.width / 2),
            y : (canvas.width / 2)
        };

        if(layerOptions.xOffset){
            position.x += parseInt(layerOptions.xOffset);
        }

        if(layerOptions.yOffset){
            position.y += parseInt(layerOptions.yOffset);
        }

        switch(this.layerModeState){
            case 'text':
                if(layerOptions.content.trim().length){
                    context.textAlign = "center";
                    context.textBaseline = "middle";
                    context.font = layerOptions.size + "px sans-serif";

                    context.fillStyle = layerOptions.invertColor ? "#000000" : "#FFFFFF";

                    context.fillText(layerOptions.content.trim(), position.x, position.y);
                }
                break;
            case 'icon':
                if(layerOptions.icon.trim().length){
                    const input = this.container.find('.icon-picker').get(0);
                    if(input && input.wpgmzaFaPicker){
                        const icons = input.wpgmzaFaPicker.getIcons();
                        if(icons.indexOf(layerOptions.icon.trim()) !== -1){
                            const faSlug = layerOptions.icon.trim();

                            /* Create a sampler element, so we can get the unicode or the icon */
                            const sampler = $('<i/>');
                            sampler.addClass(faSlug);

                            /* Append it to the DOM to be rendered */
                            this.container.append(sampler);

                            /* Get a raw reference for vanilla JS */
                            const ref = sampler.get(0);
                            let styles = window.getComputedStyle(ref,':before');

                            if(styles.content){
                                /* Pull the unicode from the before psuedo */
                                const content = styles.content.replaceAll('"', "");
                                
                                /* Get font name, to allow for FA 4 and 5 */
                                styles = window.getComputedStyle(ref);
                                context.textAlign = "center";
                                context.textBaseline = "middle";
                                context.font = styles.fontWeight + " " + layerOptions.size + "px " + styles.fontFamily;

                                context.fillStyle = layerOptions.invertColor ? "#000000" : "#FFFFFF";

                                /* Write to canvas */
                                context.fillText(content, position.x, position.y);
                            }

                            /* Remove it from the dom to keep it clean */
                            sampler.remove();
                        }
                    }
                }
                break;
        }
    }

    /**
     * Save the icon
     * 
     * Uploads created icon to WP Media, then calls the apply method to update the DOM fully 
     * 
     * @return void
     */
    WPGMZA.MarkerIconEditor.prototype.saveIcon = function(){
        this.setSaving(true);

        const canvas = this.preview.get(0);
        const imageData = canvas.toDataURL();
        if(imageData){
            $.ajax({
				url  : WPGMZA.ajaxurl,
				type : "POST",
				data : {
					action   : "wpgmza_upload_base64_image",
					security : WPGMZA.legacyajaxnonce,
					data     : imageData.replace(/^data:.+?base64,/, ''),
                    folder   : 'wp-google-maps/icons', 
					mimeType : "image/png"
				},
				success : (data) => {
                    this.setSaving(false);
                    if(data.url){
                        this.applyIcon(data.url);
                    }
				},
                error : () => {
                    this.setSaving(false);
                }
				
			});
        } else {
            this.setSaving(false);
        }
    }

    /**
     * Apply the stored icon to the DOM, or rather, the marker picker module
     * 
     * @param string url The stored URL to the marker icon 
     * 
     * @return void
     */
    WPGMZA.MarkerIconEditor.prototype.applyIcon = function(url){
        if(url && this.binding){
            this.hide(); //Hide but don't unbind, incase the user wants to make last minute changes

            const button = $(this.binding);
            const input = button.closest(".wpgmza-marker-icon-picker").find(".wpgmza-marker-icon-url");
            const preview = button.closest(".wpgmza-marker-icon-picker").find("img, .wpgmza-marker-icon-preview");
            
            input.val(url).trigger('change');

            if(preview.prop('tagName').match(/img/)){
                /* It's a standard image */
                preview.attr('src', url);
            } else {
                /* Its a background image element */
                preview.css("background-image", "url(" + url + ")");
            }
        }
    }

    /**
     * Show the editor
     * 
     * @return void
     */
    WPGMZA.MarkerIconEditor.prototype.show = function(){
        this.setVisible(true);

        this.autoPlace();

        if(this.dirty){
            this.dirty = false;
            this.prepareControls();
        }
    }

    /**
     * Hide the editor
     * 
     * @return void
     */
    WPGMZA.MarkerIconEditor.prototype.hide = function(){
        this.setVisible(false);
    }

    /**
     * Set the visibility of the editor
     * 
     * @param bool visible Visibility start 
     */
    WPGMZA.MarkerIconEditor.prototype.setVisible = function(visible){
        if(visible && this.binding){
            this.container.addClass('open');
        } else {
            this.container.removeClass('open');
        }
    }

    /**
     * Get the visibility of the editor
     * 
     * @returns bool
     */
    WPGMZA.MarkerIconEditor.prototype.isVisible = function(){
        return this.container.hasClass('open');
    } 

    /**
     * Set the current saving state of the editor
     * 
     * This effectively disables controls while uploading/storing the generated marker
     * 
     * @param bool busy If the system is currently saving
     * 
     * @return void
     */
    WPGMZA.MarkerIconEditor.prototype.setSaving = function(busy){
        this.actions.each((index, button) => {
            button = $(button);

            if(busy){
                const busyText = button.data('busy');
                if(busyText){
                    if(!button.data('restore')){
                        button.attr('data-restore', button.text());
                    }
                    button.text(busyText);
                }
            } else {
                const restoreText = button.data('restore');
                if(restoreText){
                    button.text(restoreText);
                }
            }

        });

        if(busy){
            this.container.addClass('saving');
        } else {
            this.container.removeClass('saving');
        }
    }

    /**
     * Automatically places the container based on it's use case
     * 
     * Where a sidebar is present, it will be anchored based on the map
     * 
     * In other use cases, it will be placed alongside or below the input that triggers is
     * 
     * @return void
     */
    WPGMZA.MarkerIconEditor.prototype.autoPlace = function(){
        const position = {
            x : 0,
            y : 0
        };

        const ref = this.container.get(0);
        if($(document.body).find('.wpgmza-editor .sidebar').length){
            /* Placed in a fullscreen editor style window */
            const editor = $(document.body).find('.wpgmza-editor').get(0);
            const sidebar = $(document.body).find('.wpgmza-editor .sidebar').get(0);
            
            if(sidebar.offsetWidth && sidebar.offsetWidth < editor.offsetWidth){
                position.x = sidebar.offsetWidth;

                if(editor.offsetHeight){
                    position.y = (editor.offsetHeight / 2) - (ref.offsetHeight / 2);
                }
            } else {
                position.x = (editor.offsetWidth / 2) - (ref.offsetWidth / 2);
                position.y = sidebar.offsetHeight + 10;
            }

            
        } else {
            /* Place relative to the binding controller */
            if(this.binding){
                const binding = $(this.binding);
                const wrapper = binding.closest('.wpgmza-marker-icon-picker').get(0);

                if(wrapper){
                    const boundingRect = wrapper.getBoundingClientRect();

                    position.x = wrapper.offsetLeft; // We may need to change this to offset from bounding client
                    position.y = boundingRect.top + window.scrollY + 10;
                }
                
            }
        }

        this.container.css({
            left : position.x + "px",
            top : position.y + "px"
        });
    }

    /* Global initiaizer */
    $(document).ready(function(event) {
		const element = $(".wpgmza-marker-icon-editor");

        if(!element.length){
			return;
        }

        WPGMZA.markerIconEditor = new WPGMZA.MarkerIconEditor(element);
	});
 });