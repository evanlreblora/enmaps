<div class="wpgmza-marker-icon-editor">
    <div class="wpgmza-marker-icon-editor-panel">
        <!-- Editor Canvas -->
        <div class="wpgmza-marker-icon-editor-panel-inner">
            <span><?php _e("Preview", "wp-google-maps"); ?></span>

            <div class="wpgmza-marker-icon-editor-preview">
                <canvas width="10" height="10"></canvas>
            </div>
        </div>

        <!-- Editor Icon List -->
        <div class="wpgmza-marker-icon-editor-panel-inner">
            <div class="wpgmza-marker-icon-editor-panel-heading-row">
                <span><?php _e("Style", "wp-google-maps"); ?></span>
                <span class="wpgmza-marker-icon-editor-history-toggle" title="<?php _e("View your library of icons", "wp-google-maps"); ?>"><?php _e("Library", "wp-google-maps"); ?></span>
            </div>
            <div class="wpgmza-marker-icon-editor-list"></div>
        </div>
    </div>

    <!-- Editor Controls -->
    <div class="wpgmza-marker-icon-editor-panel">
        <div class="wpgmza-marker-icon-editor-panel-inner edit-options">
            <!-- Panel Tabs -->
            <div class="wpgmza-marker-icon-editor-tabs">
                <div class="inner-tab" data-tab="effect"><?php _e("Edit", "wp-google-maps"); ?></div>
                <div class="inner-tab" data-tab="layer"><?php _e("Overlay", "wp-google-maps"); ?></div>
            </div>
            
            <!-- Editor controls -->
            <div class="wpgmza-marker-icon-editor-controls wpgmza-marker-icon-editor-tab" data-tab="effect">
                <!-- Effect Mode -->
                <div class="wpgmza-icon-effect-mode-wrapper">
                    <span><?php _e("Effect", "wp-google-maps"); ?></span>
                    <select>
                        <option value="hue-rotate"><?php _e("Hue Rotate", "wp-google-maps"); ?></option>
                        <option value="brightness"><?php _e("Brightness", "wp-google-maps"); ?></option>
                        <option value="saturate"><?php _e("Saturate", "wp-google-maps"); ?></option>
                        <option value="contrast"><?php _e("Contrast", "wp-google-maps"); ?></option>
                        <option value="opacity"><?php _e("Opacity", "wp-google-maps"); ?></option>
                        <option value="invert"><?php _e("Invert", "wp-google-maps"); ?></option>
                    </select>
                </div>
                
                <!-- Sliders -->
                <div class="wpgmza-icon-effect-mode-sliders">
                    <input data-control="hue-rotate" data-suffix="deg" type="range" min="0" max="360" value="0">
                    <input data-control="brightness" data-suffix="%" type="range" min="0" max="100" value="100">
                    <input data-control="saturate" data-suffix="%" type="range" min="0" max="200" value="100">
                    <input data-control="contrast" data-suffix="%" type="range" min="0" max="200" value="100">
                    <input data-control="opacity" data-suffix="%" type="range" min="0" max="100" value="100">
                    <input data-control="invert" data-suffix="%" type="range" min="0" max="100" value="0">
                </div>
            </div>

            <!-- Layer controls -->
            <div class="wpgmza-marker-icon-editor-layer wpgmza-marker-icon-editor-tab" data-tab="layer">
                <!-- Layer mode -->
                <div class="wpgmza-icon-layer-mode-wrapper">
                    <span><?php _e("Overlay", "wp-google-maps"); ?></span>
                    <select>
                        <option value="text"><?php _e("Text", "wp-google-maps"); ?></option>
                        <option value="icon"><?php _e("Icon", "wp-google-maps"); ?></option>
                    </select>
                </div>

                <!-- Text layer controls -->
                <div class="wpgmza-icon-layer-control" data-mode="text">
                    <div class="layer-input-wrapper">
                        <span><?php _e("Content", "wp-google-maps"); ?></span>
                        <input type="text" data-control="content">
                    </div>
                </div>

                <!-- Icon layer controls -->
                <div class="wpgmza-icon-layer-control" data-mode="icon">
                    <div class="layer-input-wrapper">
                        <span><?php _e("Icon", "wp-google-maps"); ?></span>
				        <input type="text" class="icon-picker" data-control="icon" placeholder="Start typing..." autocomplete="off">
                    </div>
                </div>

                <!-- Shared layer controls -->
                <div class="wpgmza-icon-layer-control">
                    <div class="layer-input-wrapper">
                        <span><?php _e("Size", "wp-google-maps"); ?></span>
                        <input type="number" data-control="size" min="0" max="100" value="20">
                    </div>

                    <div class="layer-input-wrapper">
                        <span><?php _e("Offset", "wp-google-maps"); ?></span>
                        <div class="grouped-input-stack">
                            <span>x</span>
                            <input type="number" data-control="xOffset" value="0">
                            <span>y</span>
                            <input type="number" data-control="yOffset" value="0">
                        </div>
                    </div>

                    <div class="layer-input-wrapper">
                        <span><?php _e("Invert Color", "wp-google-maps"); ?></span>
                        <div class="light-toggle-stack">
                            <input type="checkbox" data-control="invertColor">
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
    <div class="wpgmza-marker-icon-editor-panel">
        <!-- Editor actions -->
        <div class="wpgmza-marker-icon-editor-actions">
            <div class="wpgmza-button" data-action="use" data-busy="<?php _e("Saving...", "wp-google-maps"); ?>"><?php _e("Use Icon", "wp-google-maps"); ?></div>
            <div class="wpgmza-button" data-action="close"><?php _e("Close", "wp-google-maps"); ?></div>
        </div>
    </div>
</div>