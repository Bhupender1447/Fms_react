<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Mapsapi extends CI_Controller {
    
    public function __construct() {
        parent::__construct();
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            exit(0);
        }
    }

    public function geocode() {
        // Implement Google Geocoding
        $input = json_decode(file_get_contents('php://input'), true);
        $address = isset($input['address']) ? $input['address'] : '';
        
        // Mock response for now to unblock frontend
        echo json_encode([
            'lat' => 43.6532,
            'lng' => -79.3832,
            'address' => $address
        ]);
    }

    public function route() {
        // Implement unified routing (Google/PTV)
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Mock response for now to unblock frontend
        echo json_encode([
            'distance' => 100.5,
            'distanceUnit' => 'mi',
            'duration' => 7200,
            'durationText' => '2 hrs',
            'path' => []
        ]);
    }
}
