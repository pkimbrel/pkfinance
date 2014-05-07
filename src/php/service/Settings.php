<?php
class Settings {
    private $dataAccess;

    function __construct() {
        $this->dataAccess = new DataAccess("settings", null);
    }

    public function get() {
        $data = $this->dataAccess->read();
        header('Content-type: application/json');
        echo $data;
    }

    public function put() {
        throw new NotImplemented("Cannot update settings");
    }

    public function delete() {
        throw new NotImplemented("Cannot delete settings");
    }
}
?>
