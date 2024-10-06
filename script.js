let highestZ = 1;

class Paper {
    holdingPaper = false;
    mouseTouchX = 0;
    mouseTouchY = 0;
    mouseX = 0;
    mouseY = 0;
    prevMouseX = 0;
    prevMouseY = 0;
    velX = 0;
    velY = 0;
    rotation = Math.random() * 30 - 15;
    currentPaperX = 0;
    currentPaperY = 0;
    rotating = false;

    init(paper) {
        // Função comum para obter coordenadas de mouse ou toque
        const getCoordinates = (e) => {
            if (e.touches) {
                return {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY
                };
            } else {
                return {
                    x: e.clientX,
                    y: e.clientY
                };
            }
        };

        // Movimento: mouse ou toque
        const onMove = (e) => {
            const { x, y } = getCoordinates(e);

            if (!this.rotating) {
                this.mouseX = x;
                this.mouseY = y;
                this.velX = this.mouseX - this.prevMouseX;
                this.velY = this.mouseY - this.prevMouseY;
            }

            const dirX = x - this.mouseTouchX;
            const dirY = y - this.mouseTouchY;
            const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
            const dirNormalizedX = dirX / dirLength;
            const dirNormalizedY = dirY / dirLength;
            const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
            let degrees = 180 * angle / Math.PI;
            degrees = (360 + Math.round(degrees)) % 360;

            if (this.rotating) {
                this.rotation = degrees;
            }

            if (this.holdingPaper) {
                if (!this.rotating) {
                    this.currentPaperX += this.velX;
                    this.currentPaperY += this.velY;
                }
                this.prevMouseX = this.mouseX;
                this.prevMouseY = this.mouseY;

                paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
            }
        };

        // Início do movimento (mouse ou toque)
        const onStart = (e) => {
            e.preventDefault(); // Evita comportamento padrão (como scroll ao arrastar)
            if (this.holdingPaper) return;

            const { x, y } = getCoordinates(e);

            this.holdingPaper = true;
            paper.style.zIndex = highestZ;
            highestZ += 1;

            if (e.type === "mousedown" || (e.type === "touchstart" && e.touches.length === 1)) {
                this.mouseTouchX = x;
                this.mouseTouchY = y;
                this.prevMouseX = x;
                this.prevMouseY = y;
            }

            if (e.button === 2) {
                this.rotating = true;
            }
        };

        // Finalização do movimento (mouse ou toque)
        const onEnd = () => {
            this.holdingPaper = false;
            this.rotating = false;
        };

        // Eventos de mouse
        document.addEventListener('mousemove', onMove);
        paper.addEventListener('mousedown', onStart);
        window.addEventListener('mouseup', onEnd);

        // Eventos de toque (touch)
        document.addEventListener('touchmove', onMove);
        paper.addEventListener('touchstart', onStart);
        window.addEventListener('touchend', onEnd);
    }
}

const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
    const p = new Paper();
    p.init(paper);
});
