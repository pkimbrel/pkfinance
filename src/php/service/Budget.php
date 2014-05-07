<?php
class Budget {
    private $dataAccess;

    function __construct($payPeriod) {
        $this->dataAccess = new DataAccess("budget", $payPeriod);
    }

    public function get() {
        $data = $this->dataAccess->read();
        header('Content-type: application/json');
        echo $data;
    }

    public function put() {
    }

    public function delete() {
        throw new NotImplemented("Cannot delete budget items (yet)");
    }
}
?>
