require 'pp'
module Railway
  class Lines
    attr_accessor :lines
    def initialize
      @lines = []
    end

    def to_hash
      return @lines.map(&:to_hash)
    end

    class << self
      def tokyo
        lines = self.new
        lines.lines = [
          Line.hibiya,
          Line.joban_chiyoda,
          Line.marunouchi,
          Line.shonan_shinjuku,
          Line.yamanote,
          Line.shinjuku,
          Line.keihin_tohoku,
          Line.chiyoda,
          Line.sobu,
          Line.saikyo,
          Line.marunouchi_branch,
          Line.mita,
          Line.musashino_keiyo,
          Line.ginza,
          Line.joban,
          Line.musashino,
          Line.yurakucho,
          Line.nanboku,
          Line.nanbu,
          Line.tozai,
          Line.yokosuka,
          Line.fukutoshin,
          Line.keiyo,
          Line.hanzomon,
          Line.joban_kaisoku,
          Line.tokaido,
          Line.oedo,
          Line.chuo,
          Line.asakusa,
          Line.utsunomiya
        ]
        return lines
      end
    end
  end

  class Line
    attr_accessor :stations, :positions, :color, :name, :loop
    def initialize
      @stations = []
      @positions = []
      @color = ''
      @name = ''
      @loop = false
    end

    def to_hash
      return {
        :name => @name,
        :color => @color,
        :stations => @stations.map(&:to_hash),
        :positions => @positions,
        :loop => @loop
      }
    end

    class << self
      def yamanote
        line = self.new
        line.color = '#80c241'
        line.name = 'JR Yamanote Line'
        line.loop = true
        line.positions = [
          [454.9, 156.4],
          [446.4, 152.8],
          [251.6, 152.8],
          [243.1, 156.4],
          [170.5, 229.0],
          [166.9, 237.5],
          [166.9, 454.4],
          [170.5, 463.0],
          [208.9, 501.4],
          [217.4, 504.9],
          [361.2, 504.9],
          [369.7, 501.4],
          [479.3, 391.8],
          [482.8, 383.3],
          [482.8, 189.3],
          [479.3, 180.7]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end

      def saikyo
        line = self.new
        line.color = "#00b48d"
        line.name = "JR Saikyo Line"
        line.positions = [
          [146.9, 20.7],
          [191.3, 65.1],
          [199.9, 68.7],
          [269.0, 68.7],
          [277.5, 72.2],
          [291.6, 86.3],
          [291.6, 93.4],
          [160.8, 224.2],
          [157.2, 232.7],
          [157.2, 458.8],
          [160.8, 467.4],
          [204.9, 511.6],
          [213.5, 515.1],
          [307.0, 515.1]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end

      def keihin_tohoku
        line = self.new
        line.color = "#00B2E5"
        line.name = "JR Keihin Tohoku Line"
        line.positions = [
          [250.1, 16.9],
          [374.5, 141.2],
          [383.0, 144.7],
          [454.3, 144.7],
          [462.8, 148.2],
          [489.8, 175.2],
          [493.3, 183.7],
          [493.3, 387.3],
          [489.8, 395.8],
          [372.5, 513.1],
          [368.9, 521.7],
          [368.9, 553.9],
          [365.4, 562.4],
          [286.5, 641.3]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end

      def musashino
        line = self.new
        line.color = '#FF4500'
        line.name = 'JR Musashino Line'
        line.positions = [
          [804.3, 372.2],
          [804.3, 115.9],
          [800.8, 107.4],
          [713.5, 20.1]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end

      def musashino_keiyo
        line = self.new
        line.color = '#FF4500'
        line.name = 'JR Musashino Line'
        line.positions = [
          [494.5, 360.9],
          [590.4, 360.9],
          [598.9, 364.5],
          [646.0, 411.5],
          [654.5, 415.1],
          [753.8, 415.1],
          [762.3, 411.5],
          [800.2, 373.6],
          [807.3, 373.6],
          [844.9, 411.2]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end

      def joban_chiyoda
        line = self.new
        line.color = '#00B261'
        line.name = 'JR Joban Chiyoda Line'
        line.positions = [
          [684.0, 134.3],
          [839.7, 134.3]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end

      def yokosuka
        line = self.new
        line.color = '#000080'
        line.name = 'JR Yokosuka Line'
        line.positions = [
          [144.8, 644.2],
          [144.8, 550.7],
          [149.8, 545.7],
          [383.9, 545.7],
          [388.9, 540.7],
          [388.9, 530.7],
          [392.4, 522.2],
          [509.2, 405.4],
          [512.7, 396.9],
          [512.7, 350.9],
          [517.7, 345.9],
          [587.4, 345.9],
          [595.9, 342.3],
          [633.4, 304.9],
          [641.9, 301.4],
          [747.1, 301.4],
          [755.7, 304.9],
          [786.0, 335.2],
          [794.5, 338.8],
          [831.3, 338.8]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end

      def tokaido
        line = self.new
        line.color = '#F68B1E'
        line.name = 'JR Tokaido Line'
        line.positions = [
          [503.2, 360.9],
          [503.2, 392.2],
          [499.7, 400.8],
          [382.1, 518.4],
          [378.6, 526.9],
          [378.6, 558.5],
          [375.0, 567.0],
          [294.7, 647.3]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end

      def keiyo
        line = self.new
        line.color = '#C9252F'
        line.name = 'JR Keiyo Line'
        line.positions = [
          [490.5, 372.6],
          [587.0, 372.6],
          [595.6, 376.1],
          [640.5, 421.1],
          [649.0, 424.6],
          [759.7, 424.6],
          [768.2, 421.1],
          [800.7, 388.6],
          [807.8, 388.6],
          [834.5, 415.3]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end

      def nanbu
        line = self.new
        line.color = '#FFD400'
        line.name = 'JR Nanbu Line'
        line.positions = [
          [267.6, 639.5],
          [143.7, 515.7],
          [135.2, 512.1],
          [83.0, 512.1],
          [74.5, 508.6],
          [14.8, 448.9]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end

      def sobu
        line = self.new
        line.color = '#FFD400'
        line.name = 'JR Sobu Line'
        line.positions = [
          [11.0, 297.5],
          [181.1, 297.5],
          [186.1, 302.5],
          [186.1, 349.7],
          [191.1, 354.7],
          [270.7, 354.7],
          [279.3, 351.1],
          [335.4, 295.0],
          [344.0, 291.4],
          [457.7, 291.4],
          [467.7, 291.4],
          [490.3, 291.4],
          [500.3, 291.4],
          [751.5, 291.8],
          [760.1, 295.4],
          [791.0, 326.2],
          [799.5, 329.7],
          [836.6, 329.7]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end

      def chuo
        line = self.new
        line.color = '#F15A22'
        line.name = 'JR Chuo Line'
        line.positions = [
          [10.7, 287.3],
          [190.1, 287.3],
          [195.1, 292.3],
          [195.1, 340.0],
          [200.1, 345.0],
          [264.8, 345.0],
          [273.3, 341.5],
          [329.9, 284.9],
          [338.5, 281.4],
          [434.4, 281.4],
          [442.9, 284.9],
          [469.4, 311.4],
          [472.9, 319.9],
          [472.9, 355.9],
          [477.9, 360.9],
          [497.2, 360.9]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end

      def shonan_shinjuku
        line = self.new
        line.color = '#FF0000'
        line.name = 'JR Shonan Shinjuku Line'
        line.positions = [
          [239.2, 20.4],
          [340.4, 121.6],
          [344.0, 130.2],
          [344.0, 157.0],
          [339.0, 162.0],
          [257.4, 162.0],
          [248.9, 165.5],
          [180.2, 234.2],
          [176.7, 242.7],
          [176.7, 448.0],
          [180.2, 456.5],
          [214.2, 491.3],
          [222.7, 494.9],
          [332.3, 494.9],
          [337.3, 499.9],
          [337.3, 530.0],
          [332.3, 535.0],
          [139.0, 535.0],
          [134.0, 540.0],
          [134.0, 647.6]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end

      def utsunomiya
        line = self.new
        line.color = '#FFA500'
        line.name = 'JR Utsunomiya Line'
        line.positions = [
          [524.9, 242.8],
          [524.9, 175.8],
          [521.3, 167.2],
          [481.7, 127.8],
          [473.2, 124.3],
          [376.7, 124.3],
          [368.1, 120.7],
          [248.8, 1.4]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end

      def joban_kaisoku
        line = self.new
        line.color = '#00B261'
        line.name = 'JR Joban Kaisoku Line'
        line.positions = [
          [514.4, 233.3],
          [514.4, 189.1],
          [517.9, 180.6],
          [541.1, 157.4],
          [549.6, 153.8],
          [840.0, 153.8]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end

      def joban
        line = self.new
        line.color = '#00B261'
        line.name = 'JR Joban Line'
        line.positions = [
          [503.8, 233.3],
          [503.8, 185.9],
          [507.4, 177.4],
          [537.0, 147.7],
          [545.5, 144.2],
          [839.7, 144.2]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end

      def asakusa
        line = self.new
        line.color = '#e85298'
        line.name = 'Toei Asakusa Line'
        line.positions = [
          [188.6, 524.1],
          [241.2, 524.1],
          [249.8, 520.6],
          [290.5, 479.9],
          [299.0, 476.4],
          [331.0, 476.4],
          [336.0, 471.4],
          [336.0, 460.5],
          [339.5, 451.9],
          [345.0, 446.4],
          [353.5, 442.9],
          [554.5, 442.9],
          [559.5, 437.9],
          [559.5, 240.2],
          [564.5, 235.2],
          [659.3, 235.2]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end

      def shinjuku
        line = self.new
        line.color = '#6cbb5a'
        line.name = 'Toei Shinjuku Line'
        line.positions = [
          [150.1, 281.7],
          [190.8, 281.7],
          [199.4, 285.2],
          [232.0, 317.8],
          [240.5, 321.4],
          [251.0, 321.4],
          [259.5, 317.8],
          [291.6, 285.8],
          [298.7, 285.8],
          [348.5, 335.6],
          [357.0, 339.1],
          [376.3, 339.1],
          [381.3, 334.1],
          [381.3, 329.5],
          [386.3, 324.5],
          [649.5, 324.5],
          [654.5, 319.5],
          [654.5, 280.6],
          [659.5, 275.6],
          [780.3, 275.6],
          [788.8, 279.1],
          [803.2, 293.5]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end

      def mita
        line = self.new
        line.color = '#0079c2'
        line.name = 'Toei Mita Line'
        line.positions = [
          [243.7, 504.9],
          [274.2, 474.4],
          [282.8, 470.8],
          [345.8, 470.8],
          [354.3, 467.3],
          [411.0, 410.6],
          [419.6, 407.0],
          [428.6, 407.0],
          [433.6, 402.0],
          [433.6, 378.6],
          [430.0, 370.1],
          [402.6, 342.6],
          [399.0, 334.1],
          [399.0, 218.1],
          [404.0, 213.1],
          [421.6, 213.1],
          [423.1, 209.5],
          [399.9, 186.3],
          [391.3, 182.8],
          [324.4, 182.8],
          [319.4, 177.8],
          [319.4, 136.9],
          [315.9, 128.3],
          [269.8, 82.2],
          [261.2, 78.7],
          [194.7, 78.7],
          [186.2, 75.2],
          [138.8, 27.8]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end

      def nanboku
        line = self.new
        line.color = '#00ada9'
        line.name = 'Nanboku Line'
        line.positions = [
          [237.0, 504.9],
          [305.0, 436.9],
          [308.5, 428.3],
          [308.5, 415.1],
          [305.1, 406.5],
          [258.7, 357.8],
          [255.2, 349.2],
          [255.2, 340.9],
          [258.8, 332.3],
          [287.0, 304.1],
          [295.5, 300.6],
          [403.3, 300.6],
          [408.3, 295.6],
          [408.3, 222.1],
          [413.3, 217.1],
          [423.2, 217.1],
          [428.2, 212.1],
          [428.2, 58.5]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end

      def hanzomon
        line = self.new
        line.color = '#9b7cb6'
        line.name = 'Hanzomon Line'
        line.positions = [
          [175.5, 431.4],
          [278.3, 431.4],
          [286.8, 427.9],
          [334.5, 380.2],
          [338.0, 371.7],
          [338.0, 326.6],
          [343.0, 321.6],
          [348.8, 321.6],
          [357.4, 325.2],
          [372.6, 340.3],
          [381.1, 343.9],
          [414.6, 344.1],
          [423.2, 347.6],
          [450.1, 374.5],
          [458.6, 378.0],
          [460.0, 378.0],
          [465.0, 373.0],
          [465.0, 342.4],
          [470.0, 337.4],
          [602.0, 337.4],
          [610.5, 340.9],
          [630.6, 361.0],
          [639.1, 364.5],
          [654.5, 364.5],
          [659.5, 359.5],
          [659.5, 243.4]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end

      def hibiya
        line = self.new
        line.color = '#9caeb7'
        line.name = 'Hibiya Line'
        line.positions = [
          [623.5, 144.2],
          [623.5, 157.0],
          [618.5, 162.0],
          [555.3, 162.0],
          [550.3, 167.0],
          [550.3, 230.2],
          [545.3, 235.2],
          [508.0, 235.2],
          [503.0, 240.2],
          [503.0, 305.1],
          [508.0, 310.1],
          [576.0, 310.1],
          [581.0, 315.1],
          [581.0, 406.6],
          [586.0, 411.6],
          [626.1, 411.6],
          [631.1, 416.6],
          [631.1, 443.1],
          [626.1, 448.1],
          [551.0, 448.1],
          [542.5, 444.6],
          [495.3, 397.4],
          [486.7, 393.9],
          [393.5, 393.9],
          [385.0, 397.4],
          [336.7, 445.7],
          [328.2, 449.2],
          [226.8, 449.2],
          [218.3, 452.7],
          [168.8, 502.2]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end

      def chiyoda
        line = self.new
        line.color = '#009944'
        line.name = 'Chiyoda Line'
        line.positions = [
          [191.3, 378.0],
          [191.3, 435.3],
          [196.3, 440.3],
          [276.3, 440.3],
          [284.9, 436.8],
          [307.5, 414.2],
          [316.0, 410.6],
          [433.7, 410.6],
          [438.7, 405.6],
          [438.7, 180.5],
          [442.2, 171.9],
          [475.1, 139.0],
          [483.7, 135.5],
          [653.8, 135.5]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end

      def ginza
        line = self.new
        line.color = '#f39700'
        line.name = 'Ginza Line'
        line.positions = [
          [166.9, 426.1],
          [232.0, 426.1],
          [240.5, 422.6],
          [274.8, 388.3],
          [281.9, 388.3],
          [325.3, 431.7],
          [333.9, 435.3],
          [487.1, 435.3],
          [495.7, 431.7],
          [498.9, 428.5],
          [507.5, 425.0],
          [535.3, 425.0],
          [543.9, 421.4],
          [550.2, 415.0],
          [553.8, 406.5],
          [553.8, 336.3],
          [548.8, 331.3],
          [466.0, 331.3],
          [461.0, 326.3],
          [461.0, 247.5],
          [466.0, 242.5],
          [592.6, 242.5]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end

      def tozai
        line = self.new
        line.color = '#00a7db'
        line.name = 'Tozai Line'
        line.positions = [
          [73.2, 277.1],
          [278.1, 277.1],
          [286.6, 280.6],
          [355.9, 349.9],
          [364.4, 353.4],
          [419.3, 353.4],
          [427.8, 357.0],
          [455.4, 384.6],
          [464.0, 388.1],
          [719.9, 388.1],
          [728.5, 384.6],
          [789.8, 323.2],
          [798.4, 319.7],
          [804.3, 319.7]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end

      def oedo
        line = self.new
        line.color = '#b6007a'
        line.name = 'Toei Oedo Line'
        line.positions = [
          [121.4, 318.1],
          [121.4, 322.9],
          [124.9, 331.2],
          [208.7, 414.9],
          [217.2, 418.4],
          [222.7, 418.4],
          [227.7, 423.4],
          [227.7, 452.1],
          [232.7, 457.1],
          [416.0, 457.1],
          [424.5, 460.7],
          [444.8, 480.9],
          [453.3, 484.5],
          [643.1, 484.5],
          [648.1, 479.5],
          [648.1, 332.7],
          [644.6, 324.2],
          [604.5, 284.1],
          [601.0, 275.6],
          [601.0, 259.6],
          [596.0, 254.6],
          [449.9, 254.6],
          [444.9, 249.6],
          [444.9, 226.6],
          [439.9, 221.6],
          [408.7, 221.6],
          [403.7, 226.6],
          [403.7, 291.6],
          [398.7, 296.6],
          [354.0, 296.6],
          [345.5, 293.1],
          [311.5, 260.1],
          [303.0, 256.6],
          [202.7, 256.6],
          [194.2, 260.1],
          [139.7, 314.6],
          [131.2, 318.1],
          [102.9, 318.1],
          [97.9, 313.1],
          [97.9, 212.3],
          [94.4, 203.7],
          [66.4, 175.7],
          [57.8, 172.2],
          [49.3, 172.2]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end

      def marunouchi
        line = self.new
        line.color = '#e60012'
        line.name = 'Marunouchi Line'
        line.positions = [
          [0.0, 307.7],
          [210.2, 307.7],
          [218.6, 311.3],
          [317.2, 414.6],
          [325.6, 418.2],
          [530.0, 418.2],
          [535.0, 413.2],
          [535.0, 393.6],
          [531.5, 385.0],
          [522.5, 376.1],
          [514.0, 372.6],
          [458.0, 372.6],
          [449.5, 369.0],
          [432.8, 352.4],
          [429.3, 343.8],
          [429.3, 239.8],
          [425.7, 231.3],
          [369.1, 174.7],
          [360.6, 171.1],
          [264.1, 171.1],
          [255.6, 174.7],
          [219.2, 211.0]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end

      def marunouchi_branch
        line = self.new
        line.color = '#e60012'
        line.name = 'Marunouchi Line Branch'
        line.positions = [
          [9.7, 344.3],
          [56.4, 344.3],
          [64.9, 340.7],
          [97.9, 307.7]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end

      def yurakucho
        line = self.new
        line.color = '#d7c447'
        line.name = 'Yurakucho Line'
        line.positions = [
          [32.0, 18.4],
          [228.1, 214.5],
          [236.7, 218.1],
          [303.7, 218.1],
          [312.3, 221.6],
          [345.7, 255.1],
          [354.3, 258.6],
          [371.8, 258.6],
          [376.8, 263.6],
          [376.8, 306.8],
          [371.8, 311.8],
          [336.3, 311.8],
          [327.7, 308.2],
          [305.9, 286.4],
          [299.2, 286.1],
          [296.0, 294.3],
          [296.0, 370.1],
          [301.0, 375.1],
          [384.5, 375.1],
          [393.0, 378.7],
          [414.3, 400.0],
          [422.9, 403.5],
          [462.8, 403.5],
          [471.3, 407.0],
          [518.4, 454.1],
          [527.0, 457.7],
          [688.0, 457.7],
          [693.0, 452.7],
          [693.0, 419.8]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end

      def fukutoshin
        line = self.new
        line.color = '#9caeb7'
        line.name = 'Fukutoshin Line'
        line.positions = [
          [25.0, 22.1],
          [220.4, 217.5],
          [220.4, 217.5],
          [220.4, 389.7],
          [216.9, 398.3],
          [201.3, 413.9],
          [192.7, 417.4],
          [189.7, 417.4],
          [181.1, 420.9],
          [177.5, 424.6]
        ].map do |pair|
          {
            :x => pair.first,
            :y => pair.last
          }
        end
        return line
      end
    end
  end

  class Station
    attr_accessor :name, :size, :x, :y
    def initialize
      @name = ''
      @size = 'S'
      @x = 0
      @y = 0
    end

    def to_hash
      return {
        :name => @name,
        :size => @size,
        :x => @x,
        :y => @y
      }
    end

    class << self
      def tokyo
        stations = []
        [
        ].each do |tuple|
          station = Station.new
          station.size = tuple[0]
          station.x = tuple[1]
          station.y = tuple[2]
          stations << station
        end
        return stations
      end
    end
  end
end

if __FILE__ == $0 then
end
