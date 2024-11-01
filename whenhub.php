<?php
/**
 * @package WhenHub
 * @version 1.0
 */
/*
Plugin Name: 	WhenHub
Description: 	WhenHub. Time Matters.
Author: 		Jonathan Sheely
Version: 		1.0
Author URI: 	http://www.whenhub.com
License: 		MIT
License URI: 	https://choosealicense.com/licenses/mit/
*/


defined( 'ABSPATH' ) or die( 'Direct access disabled' );
function whenhub_load_scripts()
{
    $options = whenhub_filter_defaults(get_option('whenhub'));
        
    // WhenHub
    wp_enqueue_script('whenhub-embed',  $options['cdn_url'] . '/v1/embed.js', null, '1.0.0', true);
    wp_add_inline_script('whenhub-app', '
		window.whenhub = {
			api: "' . $options['api_url'] . '",
			site: "' . $options['site_url'] . '",
			cdn: "' . $options['cdn_url'] . '",
			viz: "' . $options['viz_url'] . '"
            
		};
	', 'before');
}

function whenhub_admin_style()
{
    wp_enqueue_style('whenhub-style', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', null, '1.0.0');
    $options = whenhub_filter_defaults(get_option('whenhub'));
?>
    
    <script type="text/javascript">
        window.whenhub = {
            api: "<?=$options['api_url'] ?>",
            site: "<?=$options['site_url'] ?>",
            cdn: "<?=$options['cdn_url'] ?>",
            viz: "<?=$options['viz_url'] ?>",
        };
    </script>
    
<?php
}

function whenhub_schedule($attrs)
{
    whenhub_load_scripts();
    $newId = substr(md5(microtime()), 0, 40);
    $options = whenhub_filter_defaults(get_option('whenhub'));
    $output = '<div ';
    
    foreach ($attrs as $key => $value) {
        $output .= 'data-' . $key . '="' . $value . '" ';
    }
    $output .= 'data-whencast="' . $newId . '"';
    $output .= 'data-api-url-base="' . $options['api_url'] . '"';
    $output .= 'data-viz-url-base="' . $options['viz_url'] . '"';
    $output .= 'id="' . $newId . '"';
    $output .= '></div>';
    
    return $output;
}

function whenhub_settings_page()
{
    ?>
        <div class="wrap">
            <h2>WhenHub Settings</h2>
            <form method="post" action="options.php">
                <?php settings_fields("whenhub_settings"); ?>
                <table class="form-table">
                    <?php whenhub_do_options(); ?>
                </table>
                <?php
                submit_button();
                ?> 
                
            </form>
        </div>
    <?php
}

function whenhub_menu()
{
    add_submenu_page('options-general.php', 'WhenHub Settings', 'WhenHub', 'administrator', 'whenhub', 'whenhub_settings_page');
}

function whenhub_init()
{
    register_setting('whenhub_settings', 'whenhub');
}



function whenhub_filter_defaults($options)
{
    if ($options['env']) {
        switch ($options['env']) {
            case 'development':
                $options['site_url'] = 'https://192-168-1-30.whenhub.co:3000/';
                $options['api_url'] = 'https://192-168-1-30.whenhub.co:3001/api/';
                $options['cdn_url'] = 'https://192-168-1-30.whenhub.co:3003/';
                $options['viz_url'] = 'https://192-168-1-30.whenhub.co:3002/';
                break;
            case 'staging':
                $options['site_url'] = 'https://studio.whenhub.net/';
                $options['api_url'] = 'https://api.whenhub.net/api/';
                $options['cdn_url'] = 'https://cdn.whenhub.net/';
                $options['viz_url'] = 'https://viz.whenhub.net/';
                break;
            case 'production':
                $options['site_url'] = 'https://studio.whenhub.com/';
                $options['api_url'] = 'https://api.whenhub.com/api/';
                $options['cdn_url'] = 'https://cdn.whenhub.com/';
                $options['viz_url'] = 'https://viz.whenhub.com/';
                break;
        }
    } else {
        $options['api_url'] = 'https://api.whenhub.com/api/';
        $options['site_url'] = 'https://studio.whenhub.com/';
        $options['cdn_url'] = 'https://cdn.whenhub.com/';
        $options['viz_url'] = 'https://viz.whenhub.com/';
    }
    return $options;
}

function whenhub_do_options()
{
    $options = whenhub_filter_defaults(get_option('whenhub'));
    ?>
    <tr valign="top">
        <th scope="row">Environment</th>
            <td>
                <select id="env" name="whenhub[env]" class="regular-text"> 
                    <option value="production" <?php selected( $options['env'], 'production' ); ?>>Production</value>
                    <option value="staging" <?php selected( $options['env'], 'staging' ); ?>>Staging</value>
                    <option value="development" <?php selected( $options['env'], 'development' ); ?>>Development</value>
                </select>
            </td>
    </tr>
    <?php
}

function whenhub_enqueue_plugin_scripts($plugin_array)
{
    $plugin_array["whenhub_button_plugin"] =  plugin_dir_url(__FILE__) . "build/editor.js";
    return $plugin_array;
}

function whenhub_register_buttons_editor($buttons)
{
    array_push($buttons, "whenhub");
    return $buttons;
}

add_filter("mce_external_plugins", "whenhub_enqueue_plugin_scripts");
add_filter("mce_buttons", "whenhub_register_buttons_editor");

add_action('admin_init', 'whenhub_init');
add_action('admin_menu', 'whenhub_menu');
add_action('admin_head', 'whenhub_admin_style');

add_shortcode('whenhub', 'whenhub_schedule');

?>
