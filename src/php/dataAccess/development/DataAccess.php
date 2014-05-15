<?php
class DataAccess {
//    private $basePath = "../../test/data/";
    private $basePath = "../../../pkfinance-livedata/data/";
    private $dataSet;
    private $payPeriod;

    function __construct($dataSet, $payPeriod) {
        $this->dataSet = $dataSet;
        $this->payPeriod = $payPeriod;
    }
    
    private function buildFilePath() {
        $dataPath = $this->basePath;
        
        if ($this->payPeriod == null) {
            $dataPath .= $this->dataSet.".json";
        } else {
            $dataPath .= $this->dataSet."/".$this->payPeriod . ".json";
        }
        
        return $dataPath;
    }

    public function read() {
        $fileData = @file_get_contents($this->buildFilePath());
        
		if ($fileData === false) {
			throw new NotFound("Unable to read data for given dataset.");
		}
        return $fileData;
    }

    public function write($data) {
        file_put_contents($this->buildFilePath(), $data);
    }

    public function delete() {
    }
}
?>
