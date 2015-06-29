<?php
require("dataAccess/FileDataAccess.php");

abstract class DataAccess {
    protected $account;
    protected $dataSet;
    protected $payPeriod;

    function __construct($account, $dataSet, $payPeriod) {
        $this->account = $account;
        $this->dataSet = $dataSet;
        $this->payPeriod = $payPeriod;
    }
    
    abstract public function read();
    abstract public function write($data);
    abstract public function delete();
    
    public static function getInstance($account, $dataSet, $payPeriod) {
        $environment = @$_SERVER["PARAM1"];
        if ($environment == null) {
            $environment = "development";
        }
        
        return new FileDataAccess($environment, $account, $dataSet, $payPeriod);
    }
}
?>
